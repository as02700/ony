var {
  text,
  chars,
  not,
  series,
  alternative,
  must,
  option,
  more,
  any,
  IR
} = require('../src');

function token(type, input, cursor, length) {
  return { type, text: input.input.slice(cursor, cursor + length), cursor, length };
}

function tokens(type, input, cursor, length, _tokens) {
  return { type, text: input.input.slice(cursor, cursor + length), cursor, length, tokens: _tokens || [] };
}

var NullLiteral = token.bind(null, 'NullLiteral');
var Identifier = token.bind(null, 'Identifier');
var NumberLiteral = token.bind(null, 'NumberLiteral');
var StringLiteral = token.bind(null, 'StringLiteral');
var ArrayLiteral = tokens.bind(null, 'ArrayLiteral');
var ObjectLiteral = tokens.bind(null, 'ObjectLiteral');

function KeyValuePairs(input, cursor, length, _tokens) {
  return {
    type: 'KeyValuePairs',
    text: input.input.slice(cursor, cursor + length),
    cursor,
    length,
    key: _tokens[0],
    value: _tokens[1],
  };
}

var upperCases = Array.apply(null, {length: 26}).map(function(_, i) {
  return String.fromCharCode(i + 65);
});

var lowerCases = upperCases.map(function(x) {return x.toLowerCase();});

var digits = Array.apply(null, {length: 10}).map(eval.call, Number);

var ir = new IR('json');
ir.decl('WS', chars(' ', '\t', '\n', '\r'));
ir.decl('LOWER_CASES', chars.apply(null, lowerCases));
ir.decl('UPPER_CASES', chars.apply(null, upperCases));
ir.decl('ALPHABET', alternative(ir.ref('LOWER_CASES'), ir.ref('UPPER_CASES')));
ir.decl('DIGIT', chars.apply(null, digits));
ir.decl('DIGITS', more(ir.ref('DIGIT')));
ir.decl('number',
  series(
    option(chars('+', '-')),
    must(
      series(
        option(ir.ref('DIGITS')),
        option(series(text('.'), ir.ref('DIGITS')))
      )
    )
  ),
  NumberLiteral
);
ir.decl('name',
  series(
    alternative(chars('$', '_'), ir.ref('ALPHABET')),
    any(
      alternative(
        ir.ref('ALPHABET'),
        ir.ref('DIGIT'),
        chars('$', '_')
      )
    )
  ),
  Identifier
);
ir.decl('null', text('null'), NullLiteral);
ir.decl('string',
  alternative(
    series(
      ir.mark('$quote', chars('"', "'")),
      any(
        alternative(
          series(text('\\'), ir.mark('$quote')),
          not(ir.mark('$quote'))
        )
      ),
      ir.mark('$quote')
    ),
  ),
  StringLiteral
);
ir.decl('array',
  series(
    text('['),
    any(ir.ref('WS')),
    any(
      series(
        option(ir.ref('value')),
        any(ir.ref('WS')),
        option(text(',')),
        any(ir.ref('WS'))
      )
    ),
    text(']'),
  ),
  ArrayLiteral
);
ir.decl('key-val',
  series(
    alternative(ir.ref('string'), ir.ref('name')),
    any(ir.ref('WS')),
    text(':'),
    any(ir.ref('WS')),
    ir.ref('value'),
  ),
  KeyValuePairs
);
ir.decl('object',
  series(
    text('{'),
    any(ir.ref('WS')),
    any(
      series(
        ir.ref('key-val'),
        any(
          any(ir.ref('WS')),
          text(','),
          any(ir.ref('WS')),
          ir.ref('key-val'),
        ),
        any(ir.ref('WS')),
        option(text(',')),
        any(ir.ref('WS'))
      )
    ),
    text('}'),
  ),
  ObjectLiteral
);
ir.decl('value', alternative(
  ir.ref('null'),
  ir.ref('number'),
  ir.ref('string'),
  ir.ref('array'),
  ir.ref('object')
));
ir.decl('json', series(
  any(ir.ref('WS')),
  ir.ref('value'),
  any(ir.ref('WS')),
));

window._ir = ir;
ir.test = function(name, input) {
  return this.declaration.__declarations[name]({input}, 0);
};

/*
function tap(tag, func) {
  return function() {
    var result = func.apply(this, arguments);
    console.log(tag, result);
    return result;
  };
}

var tar = window._tar = new IR('root');
tar.decl('kw', tap('/kw', text('return')));
tar.decl(
  'root',
  alternative(
    series(
      tap('/1', tar.ref('kw')),
      tap('/2', text('@@'))
    ),
    series(
      tap('/3', tar.ref('kw')),
      tap('/4', text('##'))
    ),
  )
);
*/