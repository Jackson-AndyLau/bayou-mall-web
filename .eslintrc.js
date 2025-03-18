// // https://eslint.org/docs/user-guide/configuring

// module.exports = {
//   root: true,
//   parser: 'babel-eslint',
//   parserOptions: {
//     sourceType: 'module'
//   },
//   env: {
//     browser: true
//   },
//   // https://github.com/standard/standard/blob/master/docs/RULES-en.md
//   extends: 'standard',
//   // required to lint *.vue files
//   plugins: ['html'],
//   // add your custom rules here
//   rules: {
//     // allow async-await
//     'generator-star-spacing': 'off',
//     // allow debugger during development
//     'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
//     // quotes: [2,'double']
//     // no-template-curly-in-string  Unexpected template string expression
//     'no-template-curly-in-string': 'off',
//     semi: 'off',
//     indent: 'off',
//     // 格式化空格设置
//     'spaced-comment': [
//       'error',
//       'always',
//       {
//         line: {
//           markers: ['/'],
//           exceptions: ['-', '+']
//         },
//         block: {
//           markers: ['!'],
//           exceptions: ['*'],
//           balanced: true
//         }
//       }
//     ]
//   }
// }

module.exports = {
  root: true,
  env: {
    es6: true, // 启用 ES6 语法支持以及新的 ES6 全局变量或类型
    node: true, // Node.js 全局变量和 Node.js 作用域
    browser: true, // 浏览器全局变量
  },
  extends: ["plugin:vue/essential", "@vue/prettier"],
  rules: {
    // 'no-console': process.env.NODE_ENV === 'production' ? 2 : 2,
    // 'no-var': 0,//禁用var，用let和const代替
    // 'camelcase': 2,//强制驼峰法命名
    // 'no-extra-semi': 2,//禁止多余的冒号
    // 'no-invalid-regexp': 2,//禁止无效的正则表达式
    // 'no-irregular-whitespace': 2,//不能有不规则的空格
    // 'no-lonely-if': 2,//禁止else语句内只有if语句
    // 'no-mixed-spaces-and-tabs': [2, false],//禁止混用tab和空格
    // 'no-multiple-empty-lines': [1, {'max': 2}],//空行最多不能超过2行
    // 'no-new': 1,//禁止在使用new构造一个实例后不赋值
    // 'no-redeclare': 2,//禁止重复声明变量
    // 'max-len': ["error", { "code": 360 }],//字符串最大长度
    // 'default-case': 2,//switch语句最后必须有default
    // 'indent': [2, 4], // 强制使用一致的缩进
    // 'eqeqeq': [2, 'always'], // 要求使用 === 和 !==
  },
  // parse: 'babel-eslint',
  "parser": "vue-eslint-parser",
  parserOptions: {
		"ecmaVersion": 7,
		"sourceType": "module"

  }
};




