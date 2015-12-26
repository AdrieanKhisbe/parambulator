/* Copyright (c) 2010-2013 Richard Rodger */

"use strict";


var Lab = require('lab');
var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var assert = require('chai').assert
var gex    = require('gex')

var parambulator = require('..')


describe('basic', function() {

  var pb



  it('happy', function(done) {
    pb = parambulator({
      atmostone$: ['path','from'],

      search: {
        required$: ['find','replace']
      },

      exactlyone$: ['red','blue'],
      atleastone$: ['a','b'],

      sub: {
        dub: {
          exactlyone$: ['x','y','z'],
        }
      },

      required$: ['foo','bar'],
      notempty$: ['z'],
    })


      done()
  })



  it('required$', function(done) {
    pb.validate({a:1,z:1,red:1,foo:1,bar:1},function(err,res){
      assert.isNull(err)
    })

    pb.validate({a:1,z:1,red:1,foo:1},function(err,res){
      assert.isNotNull(err)
      assert.equal('required$',err.parambulator.code)
    })

    pb.validate({a:1,z:1,red:1,bar:1},function(err,res){
      assert.isNotNull(err)
      assert.equal('required$',err.parambulator.code)
    })

    pb.validate({a:1,z:1,red:1,},function(err,res){
      //console.log(err)
      assert.isNotNull(err)
      assert.equal('required$',err.parambulator.code)
    })
      done()
  })


  it('exactlyone$', function(done) {
    pb.validate({a:1,z:1,red:1, foo:1,bar:1},function(err,res){
      assert.isNull(err)
    })

    pb.validate({a:1,z:1,blue:1, foo:1,bar:1},function(err,res){
      assert.isNull(err)
    })

    pb.validate({a:1,z:1,foo:1,bar:1},function(err,res){
      //console.log(err)
      assert.isNotNull(err)
      assert.equal('exactlyone$',err.parambulator.code)
    })

    pb.validate({a:1,z:1,red:1,blue:1, foo:1,bar:1},function(err,res){
      assert.isNotNull(err)
      assert.equal('exactlyone$',err.parambulator.code)
    })
      done()
  })


  it('atmostone$', function(done) {
    pb.validate({a:1,z:1,red:1,foo:1,bar:1, from:1},function(err,res){
      assert.isNull(err)
    })

    pb.validate({a:1,z:1,red:1,foo:1,bar:1, path:1},function(err,res){
      assert.isNull(err)
    })

    pb.validate({a:1,z:1,red:1,foo:1,bar:1, path:1,from:1},function(err,res){
      //console.log(err)
      assert.isNotNull(err)
      assert.equal('atmostone$',err.parambulator.code)
    })
      done()
  })


  it('atleastone$', function(done) {
    pb.validate({z:1, red:1,foo:1,bar:1,from:1, a:1},function(err,res){
      assert.isNull(err)
    })

    pb.validate({z:1, red:1,foo:1,bar:1,from:1, b:1},function(err,res){
      assert.isNull(err)
    })

    pb.validate({red:1,foo:1,bar:1,from:1, a:1,z:1,b:1},function(err,res){
      assert.isNull(err)
    })

    pb.validate({z:1, red:1,foo:1,bar:1,from:1 },function(err,res){
      //console.log(err)
      assert.isNotNull(err)
      assert.equal('atleastone$',err.parambulator.code)
    })
      done()
  })


  it('search', function(done) {
    pb.validate({a:1,z:1,red:1,foo:1,bar:1, search:{find:1,replace:1}},function(err,res){
      assert.isNull(err)
    })

    pb.validate({a:1,z:1,red:1,foo:1,bar:1, search:{find:1}},function(err,res){
      assert.isNotNull(err)
      assert.equal('required$',err.parambulator.code)
    })

    pb.validate({a:1,z:1,red:1,foo:1,bar:1, search:{replace:1}},function(err,res){
      assert.isNotNull(err)
      assert.equal('required$',err.parambulator.code)
    })
      done()
  })



  it('sublevels', function(done) {
    pb.validate({a:1,z:1,red:1,foo:1,bar:1, sub:{dub:{x:1}}},function(err,res){
      assert.isNull(err)
    })

    pb.validate({a:1,z:1,red:1,foo:1,bar:1, sub:{dub:{y:1}}},function(err,res){
      assert.isNull(err)
    })

    pb.validate({a:1,z:1,red:1,foo:1,bar:1, sub:{dub:{z:1}}},function(err,res){
      assert.isNull(err)
    })

    pb.validate({a:1,z:1,red:1,foo:1,bar:1, sub:{dub:{}}},function(err,res){
      assert.isNotNull(err)
      assert.equal('exactlyone$',err.parambulator.code)
    })

    pb.validate({a:1,z:1,red:1,foo:1,bar:1, sub:{dub:{x:1,y:1}}},function(err,res){
      assert.isNotNull(err)
      assert.equal('exactlyone$',err.parambulator.code)
    })

    pb.validate({a:1,z:1,red:1,foo:1,bar:1, sub:{dub:{x:1,y:1,z:1}}},function(err,res){
      assert.isNotNull(err)
      assert.equal('exactlyone$',err.parambulator.code)
    })
      done()
  })


  it('notempty$', function(done) {
    pb.validate({a:1,z:'',red:1,foo:1,bar:1},function(err,res){
      //console.log(err)
      assert.isNotNull(err)
      assert.equal('notempty$',err.parambulator.code)
    })

    pb.validate({a:1,z:null,red:1,foo:1,bar:1},function(err,res){
      assert.isNotNull(err)
      assert.equal('notempty$',err.parambulator.code)
    })

    pb.validate({a:1,z:undefined,red:1,foo:1,bar:1},function(err,res){
      assert.isNotNull(err)
      assert.equal('notempty$',err.parambulator.code)
    })
      done()
  })


  it('pbeasy', function(done) {
    var pbeasy_one = parambulator({one:{string$:true,required$:true}})

    pbeasy_one.validate({one:'a'},function(err,res){
      assert.isNull(err)
    })

    pbeasy_one.validate({},function(err,res){
      assert.isNotNull(err)
      assert.equal('required$',err.parambulator.code)
    })


    var pbeasy_deep = parambulator({one:{required$:true,two:{string$:true,required$:true}}})

    pbeasy_deep.validate({one:{two:'a'}},function(err,res){
      assert.isNull(err)
    })

    pbeasy_deep.validate({one:{}},function(err,res){
      assert.isNotNull(err)
      assert.equal('required$',err.parambulator.code)
    })


    var pbeasy_two = parambulator({a:1,b:'q',c:{required$:true}})

    pbeasy_two.validate({a:1,b:'q',c:'w'},function(err,res){
      assert.isNull(err)
    })

    pbeasy_two.validate({a:1,b:'q'},function(err,res){
      //console.log(err)
      assert.isNotNull(err)
      assert.equal('required$',err.parambulator.code)
    })


      done()
  })

})
