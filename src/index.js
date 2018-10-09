// ==================================================
// utils
// ==================================================

function memoriezWith(kFunc, func) {
  var cache = {};
  return function() {
    var k = kFunc.apply(this, arguments);
    if (cache.hasOwnProperty(k)) {
      return cache[k];
    }
    return cache[k] = func.apply(this, arguments);
  };
}

var nthArg = memoriezWith(
  function() {return arguments[0];},
  function(n) {
    return function() {
      return arguments[n];
    };
  }
);

// ==================================================
// predicate
// ==================================================

var text = memoriezWith(
  nthArg(0),
  function text(_text) {
    var len = Math.max(_text.length, 1);
    return function(input, cursor) {
      for (var i = 0; i < len; ++i) {
        if (_text[i] != input.input[cursor + i]) {
          return undefined;
        }
      }
      return len;
    };
  }
);

var chars = memoriezWith(
  function() {
    return Array.prototype.slice.call(arguments).join('');
  },
  function chars() {
    var _chars = Array.prototype.slice.call(arguments);
    var __chars = _chars.reduce(function(acc, char) {return (acc[char] = true, acc);}, {});
    return function(input, cursor) {
      return input.input[cursor] in __chars ? 1 : undefined;
    };
  }
);

// ==================================================
// combination
// ==================================================

function series() {
  var funcs = Array.prototype.slice.call(arguments);
  var len = funcs.length;
  return function(input, cursor) {
    var x = 0;
    var r;
    for (var i = 0; i < len; ++i) {
      r = funcs[i](input, cursor + x);
      if (r == undefined) {
        return undefined;
      }
      x += r;
    }
    return x;
  };
}

function alternative() {
  var funcs = Array.prototype.slice.call(arguments);
  var len = funcs.length;
  return function(input, cursor) {
    var r;
    for (var i = 0; i < len; ++i) {
      r = funcs[i](input, cursor);
      if (r == undefined) {
        continue;
      }
      return r;
    }
    return undefined;
  };
}

// ==================================================
// decorator
// ==================================================

function not(func) {
  return function(input, cursor) {
    var r = func(input, cursor);
    return r == undefined ? 1 : undefined;
  };
}

function must(func) {
  return function(input, cursor) {
    var r = func(input, cursor);
    return r ? r : undefined;
  };
}

function option(func) {
  return function(input, cursor) {
    var r = func(input, cursor);
    return r == undefined ? 0 : r;
  }
}

function more(func) {
  return function(input, cursor) {
    var len = input.input.length;
    var x = 0;
    var r;
    var i = cursor + x;
    do {
      r = func(input, i);
      x += r || 0;
      i = cursor + x;
    } while(r != undefined)
    return (x == 0 && r == undefined) ? undefined : x;
  };
}

function any(func) {
  return function(input, cursor) {
    var len = input.input.length;
    var x = 0;
    var r;
    var i = cursor + x;
    while (i < len && (r = func(input, i))) {
      i = cursor + (x += r);
    }
    return x;
  };
}

// ==================================================
// class Declaration
// ==================================================

function Declaration(entry) {
  this.decl = this.decl.bind(this);
  this.__ref = this.__ref.bind(this);
  this.ref = memoriezWith(nthArg(0), this.ref).bind(this);
  this.__declMark = this.__declMark.bind(this);
  this.__useMark = this.__useMark.bind(this);
  this.mark = this.mark.bind(this);
  this.parse = this.parse.bind(this);

  this.__declarations = {};
  this.__markDecls = {};
  this.__markTexts = {};
  this.__entry = entry;
}

Declaration.prototype.decl = function(name, func) {
  this.__declarations[name] = func;
};

Declaration.prototype.__ref = function(name, input, cursor) {
  return this.__declarations[name](input, cursor);
};

Declaration.prototype.ref = function(name) {
  return this.__ref.bind(this, name);
};

Declaration.prototype.__declMark = function(name, func, input, cursor) {
  var x = func(input, cursor);
  this.__markTexts[name] = x == undefined ? undefined : input.input.slice(cursor, cursor + x);
  return x;
};

Declaration.prototype.__useMark = function(name, input, cursor) {
  return text(this.__markTexts[name])(input, cursor);
}

Declaration.prototype.mark = function(name, func) {
  if (arguments.length > 1) {
    this.__markDecls[name] = this.__useMark.bind(this, name);
    return this.__declMark.bind(this, name, func);
  } else {
    return this.__markDecls[name];
  }
};

Declaration.prototype.parse = function(text) {
  return this.__declarations[this.__entry]({input: text}, 0);
};

// ==================================================
// class IR
// ==================================================

function IR(entry) {
  this.in = this.in.bind(this);
  this.out = this.out.bind(this);
  this.__aspect = this.__aspect.bind(this);
  this.decl = this.decl.bind(this);
  this.ref = this.ref.bind(this);
  this.markh = this.mark.bind(this);
  this.parse = this.parse.bind(this);

  this.declaration = new Declaration(entry);
  this.tokensStack = [[]];
  this.parseStack = [];
}

IR.prototype.in = function() {
  this.tokensStack.push([]);
};

IR.prototype.out = function(func, input, cursor, len) {
  var xs = this.tokensStack.pop();
  if (len != undefined) {
    var x = func.call(null, input, cursor, len, xs);
    var xs2 = this.tokensStack.pop();
    xs2.push(x);
    this.tokensStack.push(xs2);
  }
};

IR.prototype.__aspect = function(ctor, func, name, input, cursor) {
  ctor && this.in();
  var i = this.parseStack.push([cursor]);
  var len = func(input, cursor);
  this.parseStack[i - 1].push(len, name);
  ctor && this.out(ctor, input, cursor, len);
  return len;
};

IR.prototype.decl = function(name, func, ctor) {
  return this.declaration.decl(name, this.__aspect.bind(this, ctor, func, name));
};

IR.prototype.ref = function() {
  return this.declaration.ref.apply(this.declaration, arguments);
};

IR.prototype.mark = function() {
  return this.declaration.mark.apply(this.declaration, arguments);
};

IR.prototype.parse = function(text) {
  this.tokensStack = [[]];
  this.parseStack = [];
  var total = text.length;
  var consumed = this.declaration.parse(text);
  if (consumed == total) {
    return this.tokensStack[0][0];
  }
  var len = this.parseStack.length;
  var latest;
  for (var i = len - 1; i >= 0; --i) {
    latest = this.parseStack[i];
    if (latest[1]) {
      break;
    }
  }
  throw new Error(
    ['Can not be completely resolved. ']
    .concat(
      latest
      ? ['Fail at ', latest[0] + 1, ' "', text[latest[0] + 1], '" "', text.slice(Math.max(latest[0] - 10, 0), latest[0] + 10), '"']
      : ''
    )
    .join('')
  );
};

module.exports = {
  text: text,
  chars: chars,
  not: not,
  series: series,
  alternative: alternative,
  must: must,
  option: option,
  more: more,
  any: any,
  Declaration: Declaration,
  IR: IR,
};
