// エントリーポイント
Start = __ program:Program __ {
  return program
}

Tenji = [\u2800-\u28FF]

Tenji6 = [\u2800-\u283F]
Tenji8 = [\u2840-\u28FF]

// 点字以外はすべて空白文字として処理
IgnoreChara = [^\u2801-\u28FF]
_ = IgnoreChara*
__ = IgnoreChara*

/////////////////////////
// 1. リテラル
/////////////////////////

NullToken = [\u281D] // n ⠝ 
TrueToken = [\u281E] // t ⠞
FalseToken =[\u280B] // f ⠋

Literal
  = NullLiteral
  / BooleanLiteral
  / NumericLiteral
  / StringLiteral
  // RegularExpressionLiteral

NullLiteral
  = NullToken { return { type: "Literal", value: null }; }

BooleanLiteral
  = TrueToken { return { type: "Literal", value: true }; }
  / FalseToken { return { type: "Literal", value: false }; }

// ArrayLiteral =
// ObjectLiteral =

// GS8数値(0-9) ⠬⠡⠣⠩⠹⠱⠫⠻⠳⠪
GS8DecimalDigit = [\u282C\u2821\u2823\u2829\u2839\u2831\u282B\u283B\u2833\u282A]
GS8NonZeroDecimalDigit = [\u2821\u2823\u2829\u2839\u2831\u282B\u283B\u2833\u282A]
// 小数点 ⠲
GS8DecimalPeriod = [\u2832]
// 位取り点 ⠂
GS8DecimalSpace = [\u2802]
// 非負整数
GS8DecimalInteger
  = [\u282C] // 0
  / GS8NonZeroDecimalDigit (GS8DecimalDigit / GS8DecimalSpace)*
// 数値
GS8Number
  = GS8DecimalInteger GS8DecimalPeriod (GS8DecimalDigit / GS8DecimalSpace)* {
    return {type: "Literal", value: internal.parseGS8Number(text())}
  }
  / GS8DecimalInteger {
    return {type: "Literal", value: internal.parseGS8Number(text())}
  }

// 数符⣰
// NumChar = [\u28F0]
// 数値（0-9）⠴⠂⠆⠒⠲⠢⠖⠶⠦⠔
// DecimalDigit = [\u2834\u2802\u2806\u2812\u2832\u2822\u2816\u2836\u2826\u2814]
// NonZeroDecimalDigit = [\u2802\u2806\u2812\u2832\u2822\u2816\u2836\u2826\u2814]
// 小数点（.）⠄
// DecimalPeriod = [\u2804]
// 位取り点 ⡀
// DecimalSpace = [\u2840]

// DecimalInteger
//   = [\u2834] //"0"
//  / NonZeroDecimalDigit (DecimalDigit / DecimalSpace)*

// 数値は数符から始まる
//Number
//  = NumChar DecimalInteger DecimalPeriod (DecimalDigit / DecimalSpace)* {
//    return { type: "Literal", value: internal.parseNumber(text()) };
//  }
//  / NumChar DecimalInteger {
//    return { type: "Literal", value: internal.parseNumber(text()) };
//  }

NumericLiteral = GS8Number

SingleQuoteLeft = [\u28C4] // ⣄
SingleQuoteRight = [\u2804] //⠄ 
EscapeSequenceChar = [\u2882]  // ⢂
EscapeSequence = [\u2804\u2882]
StringLiteralChar = !EscapeSequence Tenji { return text(); }
                  / EscapeSequenceChar sequence:EscapeSequence { return sequence; }

JPStringToken = [\u285A] // J ⡚
GS8StringToken = [\u285B] // G ⡛

StringLiteral
  = JPStringToken __ SingleQuoteLeft chars:StringLiteralChar* SingleQuoteRight {
      return { type: "Literal", value: internal.convertTenji(chars.join("")) }
    }
  / GS8StringToken __ SingleQuoteLeft chars:StringLiteralChar* SingleQuoteRight {
      return { type: "Literal", value: internal.convertGS8(chars.join("")) }
    }
  / SingleQuoteLeft chars:StringLiteralChar* SingleQuoteRight {
      return { type: "Literal", value: chars.join("") }
    }

/////////////////////////
// 2. 数式
/////////////////////////

Plus = [\u2852]       // + ⡒
Hyphen = [\u2824]      // - ⠤
Asterisk = [\u289C]   // * ⢜
Slash = [\u28CC]      // / ⣌
Percent = [\u281E]    // % ⠞
Exclamation = [\u2816]// ! ⠖
Lt = [\u2894] // < ⢔
Gt = [\u2862] // > ⡢
Eq = [\u28F6] // = ⣶
And = [\u282F]// & ⠯
Or = [\u28B3] // | ⢳
Hat = [\u2850]// ^ ⡐
Question = [\u2836] // ? ⠶
Colon = [\u2812] // : ⠒
Semicolon = [\u2806] // , ⠆
RoundBracketLeft = [\u2886] // ( ⢆
RoundBracketRight = [\u2858] // ) ⡘
SquareBracketLeft = [\u28E6] //[ ⣦
SquareBracketRight= [\u28F4] //] ⣴
CurlyBracketLeft = [\u28F7] // { ⣷
CurlyBracketRight= [\u28FE] // } ⣾
Comma = [\u2802] // , ⠂
Period = [\u2804] //. ⠲


AssignmentExpression
  = left:LeftHandsSideExpression __
    Eq !Eq __
    right:AssignmentExpression
    {
      return {
        type: "AssignmentExpression",
        operator: "=",
        left: left,
        right: right,
      };
    }
  / ConditionalExpression // / *= etc

ConditionalExpression
  = test:LogicalOrExpression __
    Question __ consequent:AssignmentExpression __
    Colon __ alternate:AssignmentExpression
    {
      return {
        type: "ConditionalExpression",
        test: test,
        consequent: consequent,
        alternate: alternate,
      };
    }
    / LogicalOrExpression

LogicalOrOperator
  = $(Or Or)
LogicalOrExpression
  = head:LogicalAndExpression
    tail:(__ LogicalOrOperator __ LogicalAndExpression)*
    { return internal.buildBinaryExpression(head, tail); }

LogicalAndOperator
  = $(And And)
LogicalAndExpression
  = head:BitwiseOrExpression
    tail:(__ LogicalAndOperator __ BitwiseOrExpression)*
    { return internal.buildBinaryExpression(head, tail); }

BitwiseOrOperator
  = $(Or !(Or / Eq))

BitwiseOrExpression
  = head:BitwiseXorExpression
    tail:(__ BitwiseOrOperator __ BitwiseXorExpression)*
    { return internal.buildBinaryExpression(head, tail); }

BitwiseXorOperator
  = $(Hat !(Hat / Eq))
BitwiseXorExpression
  = head:BitwiseAndExpression
    tail:(__ BitwiseXorOperator __ BitwiseAndExpression)*
    { return internal.buildBinaryExpression(head, tail); }

BitwiseAndOperator
  = $(And !(And / Eq))
BitwiseAndExpression
  = head:EqualityExpression
    tail:(__ BitwiseAndOperator __ EqualityExpression)*
    { return internal.buildBinaryExpression(head, tail); }

EqualityOperator
  = $(Eq Eq Eq)
  / $(Exclamation Eq Eq)
  / $(Eq Eq)
  / $(Exclamation Eq)

EqualityExpression
  = head:RelationalExpression
    tail:(__ EqualityOperator __ RelationalExpression)*
    { return internal.buildBinaryExpression(head, tail); }

RelationalOperator
  = $(Lt Eq)
  / $(Gt Eq)
  / $(Lt !Lt)
  / $(Gt !Gt)
  // instanceof in

RelationalExpression
  = head:ShiftExpression
    tail:(__ RelationalOperator __ ShiftExpression)*
    { return internal.buildBinaryExpression(head, tail); }

ShiftOperator
  = $(Lt Lt !Eq)
  / $(Gt Gt Gt !Eq)
  / $(Gt Gt !Eq)

ShiftExpression
  = head:AdditiveExpression
    tail:(__ ShiftOperator __ AdditiveExpression)*
    { return internal.buildBinaryExpression(head, tail); }

AdditiveOperator
  = $(Plus !(Eq / Plus))
  / $(Hyphen !(Eq / Hyphen))

AdditiveExpression
  = head:MultiplicativeExpression
    tail:(__ AdditiveOperator __ MultiplicativeExpression)*
    { return internal.buildBinaryExpression(head, tail); }

MultiplicativeOperator
  = $(Asterisk !Eq)
  / $(Slash !Eq)
  / $(Percent !Eq)

MultiplicativeExpression
  = head:UnaryExpression
    tail:(__ MultiplicativeOperator __ UnaryExpression)*
    { return internal.buildBinaryExpression(head, tail); }

UnaryOperator = Plus (!UnaryOperator) / Hyphen (!UnaryOperator)
UnaryExpression
  = PostfixExpression
  / ope:UnaryOperator _ arg:UnaryExpression {
      const ope2 = ({"\u2824": "-", "\u2852": "+"})[ope[0] as "\u2824"|"\u2852"];
      return {
        type: "UnaryExpression",
        operator: ope2,
        argument: arg,
        prefix: true
      }
    }

PostfixExpression = LeftHandsSideExpression // ++

LeftHandsSideExpression = CallExpression / MemberExpression

MemberExpression
  = FunctionExpression
  / PrimaryExpression

CallExpression
  = head:(
      callee:MemberExpression __ args:Arguments {
        return { type: "CallExpression", callee: callee, arguments: args };
      }
    )
    tail:(
      __ args:Arguments {
        return { type: "CallExpression", arguments: args };
      }
      / __ SquareBracketLeft __ property:Expression __ SquareBracketRight {
        return {
          type: "MemberExpression",
          property: property,
          computed: true
        };
      }
      / __ Period __ property:IdentifierName {
        return {
          type: "MemberExpression",
          property: property,
          computed: false
        };
      }
    )*
    {
      return tail.reduce(
        (result: unknown, element: Record<string, unknown>) => {
          element[internal.TYPES_TO_PROPERTY_NAMES[element.type as "CallExpression"|"MemberExpression"]] = result;
          return element
        }
        ,head);
    }

Arguments = RoundBracketLeft __ args:(ArgumentList __)? RoundBracketRight {
  return internal.optionalList(internal.extractOptional(args, 0))
}

ArgumentList = head:AssignmentExpression tail:(__ Comma __ AssignmentExpression)* {
  return internal.buildList(head, tail, 3)
}

Identifier = IdentifierName

IdentifierName = IdentifierNameLeft name:($IdentifierChar+) IdentifierNameRight {
  return {
    type: "Identifier",
    name: internal.alterIdentify(name)
  }
}

IdentifierChar
  = !IdentifierEscapeSequence Tenji { return text(); }
  / EscapeSequenceChar sequence:IdentifierEscapeSequence { return sequence; }

IdentifierEscapeSequence = [\u2840\u2844\u2882]

IdentifierNameLeft = [\u2844] // ⡄
IdentifierNameRight = [\u2840]// ⡀

PrimaryExpression
  = Identifier
  / Literal
  // ArrayLiteral
  // ObjectLiteral
  / RoundBracketLeft __ expression:Expression __ RoundBracketRight {
    return expression;
  }

// 3. Function

FunctionToken = [\u280B][\u281D] // fn ⠋⠝

FunctionDeclaration
  = FunctionToken __ id:Identifier __
    RoundBracketLeft __ params:(FormalParameterList __)? RoundBracketRight __
    CurlyBracketLeft __ body:FunctionBody __ CurlyBracketRight {
      return {
        type: "FunctionExpression",
        id: id,
        params: internal.optionalList(internal.extractOptional(params, 0)),
        body: body,
      };
    }

FunctionExpression
  = FunctionToken __ id:(Identifier __)?
    RoundBracketLeft __ params:(FormalParameterList __)? RoundBracketRight __
    CurlyBracketLeft __ body:FunctionBody __ CurlyBracketRight {
      return {
        type: "FunctionExpression",
        id: internal.extractOptional(id, 0),
        params: internal.optionalList(internal.extractOptional(params, 0)),
        body: body,
      };
    }

FormalParameterList
  = head:Identifier tail:(__ Comma __ Identifier)* {
    return internal.buildList(head, tail, 3);
  }

FunctionBody
  = body:SourceElements? {
      return {
        type: "BlockStatement",
        body: internal.optionalList(body),
      }
    }

Program
  = body:SourceElements? {
      return {
        type: "Program",
        body: internal.optionalList(body),
      }
    }

SourceElements
  = head:SourceElement tail:(__ SourceElement)* {
      return internal.buildList(head, tail, 1)
    }

SourceElement
  = Statement
  / FunctionDeclaration

// 3. Statement

Statement
  = Block
  / VariableStatement
  / EmptyStatement
  / ExpressionStatement
  / IfStatement
  / IterationStatement
  / ContinueStatement
  / BreakStatement
  / ReturnStatement
  // WithStatement
  // LabelledStatement
  // SwitchStatement
  // ThrowStatement
  // TryStatement
  // DebuggerStatement

Block
  = CurlyBracketLeft __ body:(StatementList __)? CurlyBracketRight {
    return {
      type: "BlockStatement",
      body: internal.optionalList(internal.extractOptional(body, 0)),
    }
  }

StatementList
  = head:Statement tail:(__ Statement)* { return internal.buildList(head, tail, 1); }

EOS
  = __ Semicolon
  / _ &CurlyBracketRight
  / __ EOF
EOF = !.

MutableToken = [\u280D] // m ⠍
ConstToken = [\u2809]   // c ⠉ 

VariableStatement
  = token:(MutableToken / ConstToken) __ declarations:VariableDeclarationList EOS {
      return {
        type: "VariableDeclaration",
        declarations: declarations, 
        kind: token === "\u280D" ? "let" : "const",
      };
    }

VariableDeclarationList
  = head:VariableDeclaration tail:(__ Comma __ VariableDeclaration)* {
      return internal.buildList(head, tail, 3);
    }

VariableDeclaration
  = id:Identifier init:(__ Initializer)? {
      return {
        type: "VariableDeclarator",
        id: id,
        init: internal.extractOptional(init, 1)
      };
    }
 
Initializer
  = Eq !Eq __ expression:AssignmentExpression { return expression; }

EmptyStatement
  = Semicolon { return { type: "EmptyStatement" }; }

ExpressionStatement
  = !(CurlyBracketLeft / FunctionToken) expression:Expression EOS {
      return {
        type: "ExpressionStatement",
        expression: expression
      };
    }

IfToken = [\u280A]   // i ⠊
ElseToken = [\u2811] // e ⠑

IfStatement
  = IfToken __ RoundBracketLeft __ test:Expression __ RoundBracketRight __
    consequent:Statement __
    ElseToken __
    alternate:Statement
    {
      return {
        type: "IfStatement",
        test: test,
        consequent: consequent,
        alternate: alternate
      };
    }
  / IfToken __ RoundBracketLeft __ test:Expression __ RoundBracketRight __
    consequent:Statement {
      return {
        type: "IfStatement",
        test: test,
        consequent: consequent,
        alternate: null
      };
    }

WhileToken = [\u283A] // w ⠺ 
ContinueToken = [\u2817][\u2811] //  re ⠗⠑
BreakToken = [\u2803] // b ⠃
ReturnToken = [\u2817] // r ⠗

IterationStatement
  = WhileToken __ RoundBracketLeft test:Expression __ RoundBracketRight __
    body:Statement
    { return { type: "WhileStatement", test: test, body: body }; }
// dowhile, for etc

ContinueStatement
  = ContinueToken EOS {
      return { type: "ContinueStatement", label: null };
    }

BreakStatement
  = BreakToken EOS {
      return { type: "BreakStatement", label: null };
    }

ReturnStatement
  = ReturnToken EOS {
      return { type: "ReturnStatement", argument: null };
    }
  / ReturnToken __ argument: Expression EOS {
      return { type: "ReturnStatement", argument: argument };
    }

Expression
  = head:AssignmentExpression tail:(__ Colon __ AssignmentExpression)* {
      return tail.length > 0
        ? { type: "SequenceExpression", expressions: internal.buildList(head, tail, 3) }
        : head;
    }


