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
    this.currentOrder = 0;
    this.elementVal = '';
    this.idVal = '';
    this.classes = [];
    this.attrs = [];
    this.pseudoClasses = [];
    this.pseudoElementVal = '';
    this.error = new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    this.orderError = new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
  }

  element(element) {
    if (this.elementVal) throw this.error;
    if (this.currentOrder > 1) throw this.orderError;
    this.currentOrder = 1;
    this.elementVal = element;
    return this;
  }

  getElement() {
    if (this.elementVal) return this.elementVal;
    return '';
  }

  id(val) {
    if (this.idVal) throw this.error;
    if (this.currentOrder > 2) throw this.orderError;
    this.currentOrder = 2;
    this.idVal = val;
    return this;
  }

  getId() {
    if (this.idVal) return `#${this.idVal}`;
    return '';
  }

  class(val) {
    if (this.currentOrder > 3) throw this.orderError;
    this.currentOrder = 3;
    this.classes.push(val);
    return this;
  }

  getClass() {
    if (this.classes.length) return `.${this.classes.join('.')}`;
    return '';
  }

  attr(val) {
    if (this.currentOrder > 4) throw this.orderError;
    this.currentOrder = 4;
    this.attrs.push(val);
    return this;
  }

  getAttr() {
    if (this.attrs.length) return this.attrs.map((el) => `[${el}]`).join('');
    return '';
  }

  pseudoClass(val) {
    if (this.currentOrder > 5) throw this.orderError;
    this.currentOrder = 5;
    this.pseudoClasses.push(val);
    return this;
  }

  getPseudoClass() {
    if (this.pseudoClasses.length) return `:${this.pseudoClasses.join(':')}`;
    return '';
  }

  pseudoElement(val) {
    if (this.currentOrder > 6) throw this.orderError;
    this.currentOrder = 6;
    if (this.pseudoElementVal) throw this.error;
    this.pseudoElementVal = val;
    return this;
  }

  getPseudoElement() {
    if (this.pseudoElementVal) return `::${this.pseudoElementVal}`;
    return '';
  }

  stringify() {
    return `${this.getElement()}${this.getId()}${this.getClass()}${this.getAttr()}${this.getPseudoClass()}${this.getPseudoElement()}`;
  }
}

const cssSelectorBuilder = {
  element(value) {
    const elemenVal = new Element();
    elemenVal.element(value);
    return elemenVal;
  },

  id(value) {
    const elemenVal = new Element();
    elemenVal.id(value);
    return elemenVal;
  },

  class(value) {
    const elemenVal = new Element();
    elemenVal.class(value);
    return elemenVal;
  },

  attr(value) {
    const elemenVal = new Element();
    elemenVal.attr(value);
    return elemenVal;
  },

  pseudoClass(value) {
    const elemenVal = new Element();
    elemenVal.pseudoClass(value);
    return elemenVal;
  },

  pseudoElement(value) {
    const elemenVal = new Element();
    elemenVal.pseudoElement(value);
    return elemenVal;
  },

  combine(selector1, combinator, selector2) {
    this.str = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
    return this;
  },

  stringify() {
    const s = this.str;
    this.str = '';
    return s;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
