/* Copyright (c) 2010-2013 Richard Rodger */

'use strict';

var Lab = require('lab')
var lab = exports.lab = Lab.script()
var describe = lab.describe
var it = lab.it
var assert = require('chai').assert
var gex    = require('gex')

var parambulator = require('..')



describe('value', function() {

  var pb = parambulator({
    a: 'a',
    b: 'b*',
    c: {wild$:'*c'},
    d: {eq$:'d*'},
    e: {re$:'e[z]'},
    f: {re$:'/f[z]/i'},
    g: {enum$:['A','B','C']},
    h: {minlen$:2},
    i: {maxlen$:6},
    j: {lt$: 2},
    k: {lt$: new Date("2012-09-04")},
    l: {lte$: 2},
    m: {lte$: new Date("2012-09-04")},
    n: {gt$: 2},
    o: {gt$: new Date("2012-09-04")},
    p: {gte$: 2},
    q: {gte$: new Date("2012-09-04")},
    r: {min$: 2},
    s: {min$: new Date("2012-09-04")},
    t: {max$: 2},
    u: {max$: new Date("2012-09-04")},
    v: {uniq$: [true]},
    wild$:'top*', // does nothing
  })


  it('wild$', function(done) {

    pb.validate({},function(err,res){
      assert.isNull(err)
    })

    pb.validate({a:'a'},function(err,res){
      assert.isNull(err)
    })

    pb.validate({b:'bx'},function(err,res){
      assert.isNull(err)
    })

    pb.validate({c:'xc'},function(err,res){
      assert.isNull(err)
    })

    pb.validate({a:'b'},function(err,res){
      //console.log(err)
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'wild$')
    })

      done()
  })


  it('eq$', function(done) {
    pb.validate({d:'d*'},function(err,res){
      assert.isNull(err)
    })

    pb.validate({d:'dx'},function(err,res){
      //console.log(err)
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'eq$')
    })
      done()
  })


  it('minlen$', function(done) {
    // test for string values
    pb.validate({h:'abcde'},function(err,res){
      assert.isNull(err)
    })

    pb.validate({h:'a'},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'minlen$')
    })

    // test arrays
    pb.validate({h:[1,2,3,4]},function(err,res){
      assert.isNull(err)
    })

    pb.validate({h:[1]},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'minlen$')
    })


    // test objects
    pb.validate({h:{1:1, 2:2, 3:3, 4:4}},function(err,res){
      assert.isNull(err)
    })

    pb.validate({h:{1:1}},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'minlen$')
    })
      done()
  })


  it('maxlen$', function(done) {
    // test string values
    pb.validate({i:'abcde'},function(err,res){
      assert.isNull(err)
    })

    pb.validate({i:'abcdefgh'},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'maxlen$')
    })

    // test arrays
    pb.validate({i:[1,2,3,4,5]},function(err,res){
      assert.isNull(err)
    })

    pb.validate({i:[1,2,3,4,5,6,7]},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'maxlen$')
    })

    // test objects
    pb.validate({i:{1:1, 2:2, 3:3, 4:4, 5:5}},function(err,res){
      assert.isNull(err)
    })

    pb.validate({i:{1:1, 2:2, 3:3, 4:4, 5:5, 6:6, 7:7}},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'maxlen$')
    })

      done()
  })


  it('lt$', function(done) {
    pb.validate({j: 1},function(err,lt){
      assert.isNull(err)
    })

    pb.validate({j: 3}, function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code, 'lt$')
    })

    pb.validate({k: new Date("2012-09-03")}, function(err,res) {
      assert.isNull(err)
    })

    pb.validate({k: new Date("2012-09-04")}, function(err,res) {
      assert.isNotNull(err)
      assert.equal(err.parambulator.code, 'lt$')
    })
      done()
  })


  it('lte$', function(done) {
    pb.validate({l: 1},function(err,lt){
      assert.isNull(err)
    })

    pb.validate({l: 2},function(err,lt){
      assert.isNull(err)
    })

    pb.validate({l: 3}, function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code, 'lte$')
    })

    pb.validate({m: new Date("2012-09-04")}, function(err,res) {
      assert.isNull(err)
    })

    pb.validate({m: new Date("2012-09-05")}, function(err,res) {
      assert.isNotNull(err)
      assert.equal(err.parambulator.code, 'lte$')
    })
      done()
  })


  it('gt$', function(done) {
    pb.validate({n: 3},function(err,lt){
      assert.isNull(err)
    })

    pb.validate({n: 2}, function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code, 'gt$')
    })

    pb.validate({o: new Date("2012-09-05")}, function(err,res) {
      assert.isNull(err)
    })

    pb.validate({o: new Date("2012-09-04")}, function(err,res) {
      assert.isNotNull(err)
      assert.equal(err.parambulator.code, 'gt$')
    })
      done()
  })


  it('gte$', function(done) {
    pb.validate({p: 2},function(err,lt){
      assert.isNull(err)
    })

    pb.validate({p: 3},function(err,lt){
      assert.isNull(err)
    })

    pb.validate({p: 1}, function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code, 'gte$')
    })

    pb.validate({q: new Date("2012-09-04")},function(err,res) {
      assert.isNull(err)
    })

    pb.validate({q: new Date("2012-09-03")},function(err,res) {
      assert.isNotNull(err)
      assert.equal(err.parambulator.code, 'gte$')
    })
      done()
  })


  it('min$', function(done) {
    pb.validate({r: 2},function(err,lt){
      assert.isNull(err)
    })

    pb.validate({r: 3},function(err,lt){
      assert.isNull(err)
    })

    pb.validate({r: 1}, function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code, 'min$')
    })

    pb.validate({s: new Date("2012-09-04")},function(err,res) {
      assert.isNull(err)
    })

    pb.validate({s: new Date("2012-09-03")},function(err,res) {
      assert.isNotNull(err)
      assert.equal(err.parambulator.code, 'min$')
    })
      done()
  })


  it('max$', function(done) {
    pb.validate({t: 1},function(err,lt){
      assert.isNull(err)
    })

    pb.validate({t: 2},function(err,lt){
      assert.isNull(err)
    })

    pb.validate({t: 3},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code, 'max$')
    })

    pb.validate({u: new Date("2012-09-04")},function(err,res){
      assert.isNull(err)
    })

    pb.validate({u: new Date("2012-09-05")},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code, 'max$')
    })
      done()
  })


  it('uniq$', function(done) {
    pb.validate({v: [1,2,3]},function(err,res){
      assert.isNull(err)
    })

    pb.validate({v: [1,2,3,1]},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code, 'uniq$')
    })
      done()
  })


  it('re$', function(done) {
    pb.validate({e:'ez'},function(err,res){
      assert.isNull(err)
    })

    pb.validate({e:'ex'},function(err,res){
      //console.log(err)
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'re$')
    })

    pb.validate({f:'FZ'},function(err,res){
      assert.isNull(err)
    })

    pb.validate({f:'fx'},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'re$')
    })
      done()
  })


  it('enum$', function(done) {
    pb.validate({g:'A'},function(err,res){
      assert.isNull(err)
    })

    pb.validate({g:'X'},function(err,res){
      //console.log(err)
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'enum$')
    })
      done()
  })


  it('toplevel', function(done) {

    var pb = parambulator({
      type$:'object'
    })

    pb.validate({},function(err){
      assert.isNull(err)
    })

    pb.validate("foo",function(err){
      assert.isNotNull(err)
    })
      done()
  })

})
