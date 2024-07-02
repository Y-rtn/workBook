//使用tsc对文件进行编译------tsc xxx.js
(() => {
  let a : number
  a = 1

  function sum (a: number, b: number): number{
    return a + b
  }
  console.log(sum( 123, 346));

  /**
   * 变量
   * string、boolean、number
   * 字面量(限制改值就是字面量的类型)、any、unknown
   * void、never
   */

  //any可以赋值给任意变量
  let e : any
  e = 'qqq'
  e = 123

  //unknown表示未知变量类型
  //unknown可以赋值给任意变量
  let b : unknown
  b = 777
  b = '333'

  let s : string

  s = e
  
  //类型断言，可以告诉解析器变量实际类型
  /**
   * 语法
   *  变量 as 类型
   *  <类型>变量
   */

  if(typeof b === 'string') {
    s= b
  }
  s = b as string
  s = <string> b

  //void表示空，以函数为例，表没有返回值的函数（undefined）
  function fn() : void{

  }

  //never表永远不会返回结果
  function fn2() : never{
    throw Error('报错了')
  }

  //object表示一个对象
  let o : object
  o = {}
  o = function () {}

  //{}指定对象中可以包含哪些属性
  //在属性后加？表属性可选
  let y : {name: string, age?: number}
  y = {name: "jjj", age: 12}

  //[propName: string] any 表任意类型属性
  let q : {name: string, [propName: string]: any}
  q = {name: 'yyy', age: 111}

  /**
   * 设置结构类型声明 
   * 语法 (参数：型参，参数：型参...) => 返回值
   */
  let w : (a: number, b: number) => number
  w = function (n1: number, n2: number): number{
    return 10
  }

  /**
   * 数组类型声明
   *  类型[]
   *  Array<类型>
   */
  //string[]表示字符串数组
  let t : string[]
  let g :  Array<number>
  g = [1, 2, 3]

  /**
   * 元组，元组是固定长度的数组
   */
  let h : [string, string]
  h = ['123', '333']

  /**
   * enum 枚举
   * 
   */
  enum Gender{
    Male = 0,
    Female = 1
  }
  let i : {name: string, gender: Gender}
  i = {
    name: 'hahaha',
    gender: Gender.Male
  }
  console.log(i.gender === Gender.Male)

  //&表示同时
  let j: {name: string} & {age: number}

  //类型别名
  type myType = 1 | 2 | 3 | 4
  let k : myType
  k = 2

  let z: string
})();


 