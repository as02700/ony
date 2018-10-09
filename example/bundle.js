/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./example/json.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./example/json.js":
/*!*************************!*\
  !*** ./example/json.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var {\n  text,\n  chars,\n  not,\n  series,\n  alternative,\n  must,\n  option,\n  more,\n  any,\n  IR\n} = __webpack_require__(/*! ../src */ \"./src/index.js\");\n\nfunction token(type, input, cursor, length) {\n  return { type, text: input.input.slice(cursor, cursor + length), cursor, length };\n}\n\nfunction tokens(type, input, cursor, length, _tokens) {\n  return { type, text: input.input.slice(cursor, cursor + length), cursor, length, tokens: _tokens || [] };\n}\n\nvar NullLiteral = token.bind(null, 'NullLiteral');\nvar Identifier = token.bind(null, 'Identifier');\nvar NumberLiteral = token.bind(null, 'NumberLiteral');\nvar StringLiteral = token.bind(null, 'StringLiteral');\nvar ArrayLiteral = tokens.bind(null, 'ArrayLiteral');\nvar ObjectLiteral = tokens.bind(null, 'ObjectLiteral');\n\nfunction KeyValuePairs(input, cursor, length, _tokens) {\n  return {\n    type: 'KeyValuePairs',\n    text: input.input.slice(cursor, cursor + length),\n    cursor,\n    length,\n    key: _tokens[0],\n    value: _tokens[1],\n  };\n}\n\nvar upperCases = Array.apply(null, {length: 26}).map(function(_, i) {\n  return String.fromCharCode(i + 65);\n});\n\nvar lowerCases = upperCases.map(function(x) {return x.toLowerCase();});\n\nvar digits = Array.apply(null, {length: 10}).map(eval.call, Number);\n\nvar ir = new IR('json');\nir.decl('WS', chars(' ', '\\t', '\\n', '\\r'));\nir.decl('LOWER_CASES', chars.apply(null, lowerCases));\nir.decl('UPPER_CASES', chars.apply(null, upperCases));\nir.decl('ALPHABET', alternative(ir.ref('LOWER_CASES'), ir.ref('UPPER_CASES')));\nir.decl('DIGIT', chars.apply(null, digits));\nir.decl('DIGITS', more(ir.ref('DIGIT')));\nir.decl('number',\n  series(\n    option(chars('+', '-')),\n    must(\n      series(\n        option(ir.ref('DIGITS')),\n        option(series(text('.'), ir.ref('DIGITS')))\n      )\n    )\n  ),\n  NumberLiteral\n);\nir.decl('name',\n  series(\n    alternative(chars('$', '_'), ir.ref('ALPHABET')),\n    any(\n      alternative(\n        ir.ref('ALPHABET'),\n        ir.ref('DIGIT'),\n        text('_')\n      )\n    )\n  ),\n  Identifier\n);\nir.decl('null', text('null'), token);\nir.decl('string',\n  alternative(\n    series(\n      ir.mark('$quote', chars('\"', \"'\", '`')),\n      any(\n        alternative(\n          series(text('\\\\'), ir.mark('$quote')),\n          not(ir.mark('$quote'))\n        )\n      ),\n      ir.mark('$quote')\n    ),\n  ),\n  NullLiteral\n);\nir.decl('array',\n  series(\n    text('['),\n    any(ir.ref('WS')),\n    any(\n      series(\n        option(ir.ref('json')),\n        any(ir.ref('WS')),\n        option(text(',')),\n        any(ir.ref('WS'))\n      )\n    ),\n    text(']'),\n  ),\n  ArrayLiteral\n);\nir.decl('key-val',\n  series(\n    alternative(ir.ref('string'), ir.ref('name')),\n    any(ir.ref('WS')),\n    text(':'),\n    any(ir.ref('WS')),\n    ir.ref('json'),\n  ),\n  KeyValuePairs\n);\nir.decl('object',\n  series(\n    text('{'),\n    any(ir.ref('WS')),\n    any(\n      series(\n        ir.ref('key-val'),\n        any(\n          any(ir.ref('WS')),\n          text(','),\n          any(ir.ref('WS')),\n          ir.ref('key-val'),\n        ),\n        any(ir.ref('WS')),\n        option(text(',')),\n        any(ir.ref('WS'))\n      )\n    ),\n    text('}'),\n  ),\n  ObjectLiteral\n);\nir.decl('json', alternative(\n  ir.ref('null'),\n  ir.ref('number'),\n  ir.ref('string'),\n  ir.ref('array'),\n  ir.ref('object')\n));\n\nwindow._ir = ir;\nir.test = function(name, input) {\n  return this.declaration.__declarations[name]({input}, 0);\n};\n\n\n//# sourceURL=webpack:///./example/json.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// ==================================================\n// utils\n// ==================================================\n\nfunction memoriezWith(kFunc, func) {\n  var cache = {};\n  return function() {\n    var k = kFunc.apply(this, arguments);\n    if (cache.hasOwnProperty(k)) {\n      return cache[k];\n    }\n    return cache[k] = func.apply(this, arguments);\n  };\n}\n\nvar nthArg = memoriezWith(\n  function() {return arguments[0];},\n  function(n) {\n    return function() {\n      return arguments[n];\n    };\n  }\n);\n\n// ==================================================\n// predicate\n// ==================================================\n\nvar text = memoriezWith(\n  nthArg(0),\n  function text(_text) {\n    var len = Math.max(_text.length, 1);\n    return function(input, cursor) {\n      for (var i = 0; i < len; ++i) {\n        if (_text[i] != input.input[cursor + i]) {\n          return undefined;\n        }\n      }\n      return len;\n    };\n  }\n);\n\nvar chars = memoriezWith(\n  function() {\n    return Array.prototype.slice.call(arguments).join('');\n  },\n  function chars() {\n    var _chars = Array.prototype.slice.call(arguments);\n    var __chars = _chars.reduce(function(acc, char) {return (acc[char] = true, acc);}, {});\n    return function(input, cursor) {\n      return input.input[cursor] in __chars ? 1 : undefined;\n    };\n  }\n);\n\n// ==================================================\n// combination\n// ==================================================\n\nfunction series() {\n  var funcs = Array.prototype.slice.call(arguments);\n  var len = funcs.length;\n  return function(input, cursor) {\n    var x = 0;\n    var r;\n    for (var i = 0; i < len; ++i) {\n      r = funcs[i](input, cursor + x);\n      if (r == undefined) {\n        return undefined;\n      }\n      x += r;\n    }\n    return x;\n  };\n}\n\nfunction alternative() {\n  var funcs = Array.prototype.slice.call(arguments);\n  var len = funcs.length;\n  return function(input, cursor) {\n    var r;\n    for (var i = 0; i < len; ++i) {\n      r = funcs[i](input, cursor);\n      if (r == undefined) {\n        continue;\n      }\n      return r;\n    }\n    return undefined;\n  };\n}\n\n// ==================================================\n// decorator\n// ==================================================\n\nfunction not(func) {\n  return function(input, cursor) {\n    var r = func(input, cursor);\n    return r == undefined ? 1 : undefined;\n  };\n}\n\nfunction must(func) {\n  return function(input, cursor) {\n    var r = func(input, cursor);\n    return r ? r : undefined;\n  };\n}\n\nfunction option(func) {\n  return function(input, cursor) {\n    var r = func(input, cursor);\n    return r == undefined ? 0 : r;\n  }\n}\n\nfunction more(func) {\n  return function(input, cursor) {\n    var len = input.input.length;\n    var x = 0;\n    var r;\n    var i = cursor + x;\n    do {\n      r = func(input, i);\n      x += r || 0;\n      i = cursor + x;\n    } while(r != undefined)\n    return (x == 0 && r == undefined) ? undefined : x;\n  };\n}\n\nfunction any(func) {\n  return function(input, cursor) {\n    var len = input.input.length;\n    var x = 0;\n    var r;\n    var i = cursor + x;\n    while (i < len && (r = func(input, i))) {\n      i = cursor + (x += r);\n    }\n    return x;\n  };\n}\n\n// ==================================================\n// class Declaration\n// ==================================================\n\nfunction Declaration(entry) {\n  this.decl = this.decl.bind(this);\n  this.__ref = this.__ref.bind(this);\n  this.ref = memoriezWith(nthArg(0), this.ref).bind(this);\n  this.__declMark = this.__declMark.bind(this);\n  this.__useMark = this.__useMark.bind(this);\n  this.mark = this.mark.bind(this);\n  this.parse = this.parse.bind(this);\n\n  this.__declarations = {};\n  this.__markDecls = {};\n  this.__markTexts = {};\n  this.__entry = entry;\n}\n\nDeclaration.prototype.decl = function(name, func) {\n  this.__declarations[name] = func;\n};\n\nDeclaration.prototype.__ref = function(name, input, cursor) {\n  return this.__declarations[name](input, cursor);\n};\n\nDeclaration.prototype.ref = function(name) {\n  return this.__ref.bind(this, name);\n};\n\nDeclaration.prototype.__declMark = function(name, func, input, cursor) {\n  var x = func(input, cursor);\n  this.__markTexts[name] = x == undefined ? undefined : input.input.slice(cursor, cursor + x);\n  return x;\n};\n\nDeclaration.prototype.__useMark = function(name, input, cursor) {\n  return text(this.__markTexts[name])(input, cursor);\n}\n\nDeclaration.prototype.mark = function(name, func) {\n  if (arguments.length > 1) {\n    this.__markDecls[name] = this.__useMark.bind(this, name);\n    return this.__declMark.bind(this, name, func);\n  } else {\n    return this.__markDecls[name];\n  }\n};\n\nDeclaration.prototype.parse = function(text) {\n  return this.__declarations[this.__entry]({input: text}, 0);\n};\n\n// ==================================================\n// class IR\n// ==================================================\n\nfunction IR(entry) {\n  this.in = this.in.bind(this);\n  this.out = this.out.bind(this);\n  this.__aspect = this.__aspect.bind(this);\n  this.decl = this.decl.bind(this);\n  this.ref = this.ref.bind(this);\n  this.markh = this.mark.bind(this);\n  this.parse = this.parse.bind(this);\n\n  this.declaration = new Declaration(entry);\n  this.tokensStack = [[]];\n  this.parseStack = [];\n}\n\nIR.prototype.in = function() {\n  this.tokensStack.push([]);\n};\n\nIR.prototype.out = function(func, input, cursor, len) {\n  var xs = this.tokensStack.pop();\n  if (len != undefined) {\n    var x = func.call(null, input, cursor, len, xs);\n    var xs2 = this.tokensStack.pop();\n    xs2.push(x);\n    this.tokensStack.push(xs2);\n  }\n};\n\nIR.prototype.__aspect = function(ctor, func, name, input, cursor) {\n  ctor && this.in();\n  var i = this.parseStack.push([cursor]);\n  var len = func(input, cursor);\n  this.parseStack[i - 1].push(len, name);\n  ctor && this.out(ctor, input, cursor, len);\n  return len;\n};\n\nIR.prototype.decl = function(name, func, ctor) {\n  return this.declaration.decl(name, this.__aspect.bind(this, ctor, func, name));\n};\n\nIR.prototype.ref = function() {\n  return this.declaration.ref.apply(this.declaration, arguments);\n};\n\nIR.prototype.mark = function() {\n  return this.declaration.mark.apply(this.declaration, arguments);\n};\n\nIR.prototype.parse = function(text) {\n  this.tokensStack = [[]];\n  this.parseStack = [];\n  var total = text.length;\n  var consumed = this.declaration.parse(text);\n  if (consumed == total) {\n    return this.tokensStack[0][0];\n  }\n  var len = this.parseStack.length;\n  var latest;\n  for (var i = len - 1; i >= 0; --i) {\n    latest = this.parseStack[i];\n    if (latest[1]) {\n      break;\n    }\n  }\n  throw new Error(\n    ['Can not be completely resolved. ']\n    .concat(\n      latest\n      ? ['Fail at ', latest[0] + 1, ' \"', text[latest[0] + 1], '\" \"', text.slice(Math.max(latest[0] - 10, 0), latest[0] + 10), '\"']\n      : ''\n    )\n    .join('')\n  );\n};\n\nmodule.exports = {\n  text: text,\n  chars: chars,\n  not: not,\n  series: series,\n  alternative: alternative,\n  must: must,\n  option: option,\n  more: more,\n  any: any,\n  Declaration: Declaration,\n  IR: IR,\n};\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });