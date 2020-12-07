/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea() {
      return this.width * this.height;
    },
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  Object.setPrototypeOf(obj, proto);
  return obj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class Element {
  constructor() {
    this.element = '';
    this.id = '';
    this.classes = [];
    this.attrs = [];
    this.pseudoClasses = [];
    this.pseudoElementVal = '';
  }

  set element(element) {
    this.elementVal = element;
  }

  get element() {
    if (this.elementVal) return this.elementVal;
    return '';
  }

  set id(val) {
    this.idVal = val;
  }

  get id() {
    if (this.idVal) return `#${this.idVal}`;
    return '';
  }

  set class(val) {
    this.classes.push(val);
  }

  get class() {
    if (this.classes.length) return `.${this.classes.join('.')}`;
    return '';
  }

  set attr(val) {
    this.attrs.push(val);
  }

  get attr() {
    if (this.attrs.length) return this.attrs.map((el) => `[${el}]`).join('');
    return '';
  }

  set pseudoClass(val) {
    this.pseudoClasses.push(val);
  }

  get pseudoClass() {
    if (this.pseudoClasses.length) return `:${this.pseudoClasses.join(':')}`;
    return '';
  }

  set pseudoElement(val) {
    this.pseudoElementVal = val;
  }

  get pseudoElement() {
    if (this.pseudoElementVal) return `::${this.pseudoElementVal}`;
    return '';
  }

  toString() {
    return `${this.element}${this.id}${this.class}${this.attr}${this.pseudoClass}${this.pseudoElement}`;
  }
}

const cssSelectorBuilder = {
  element(value) {
    this.elemenVal = new Element();
    this.elemenVal.element = value;
    return this;
  },

  id(value) {
    if (!this.elemenVal) this.elemenVal = new Element();
    this.elemenVal.id = value;
    return this;
  },

  class(value) {
    if (!this.elemenVal) this.elemenVal = new Element();
    this.elemenVal.class = value;
    return this;
  },

  attr(value) {
    if (!this.elemenVal) this.elemenVal = new Element();
    this.elemenVal.attr = value;
    return this;
  },

  pseudoClass(value) {
    if (!this.elemenVal) this.elemenVal = new Element();
    this.elemenVal.pseudoClass = value;
    return this;
  },

  pseudoElement(value) {
    if (!this.elemenVal) this.elemenVal = new Element();
    this.elemenVal.pseudoElement = value;
    return this;
  },

  combine(selector1, combinator, selector2) {
    if (this.str) this.str = '';
    // console.log('selector1:', selector1);
    this.str += selector1.build();
    this.str += ` ${combinator} `;
    // console.log('selector2:', selector2);
    this.str += selector2.build();
    return this;
  },

  stringify() {
    throw new Error('Not implemented');
    /*
    if (this.elemenVal) return this.build();
    return this.str; */
  },

  build() {
    const str = this.elemenVal.toString();
    delete this.elemenVal;
    return str;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
