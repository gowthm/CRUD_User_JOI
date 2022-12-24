var expect = require('chai').expect;
const assert = require('chai').assert;
const should = require('chai').should();
var request = require('request');

describe('Main & Test Page', function () {
  describe('Login Page', function () {
    it('Login By UserName And Password', function (done) {
      request('http://localhost:3030/login', function (error, response, body) {
        done();
      });
    });
  })
  describe('Add page', function () {
    it('Add User Details', function (done) {
      request('http://localhost:3030/user/add', function (error, response, body) {
      })
      done();
    })

  })
  describe('Update page', function () {
    it('Update User Details', function (done) {
      request('http://localhost:3030/update/:id', function (error, response, body) {
      })
      done();
    })

  })
  describe('Get By Id', function () {
    it('Get User Details By ID', function (done) {
      request('http://localhost:3030/user/getUserById/:id', function (error, response, body) {
      })
      done();
    })

  })
  describe('Get All User', function () {
    it('Get All User Details', function (done) {
      request('http://localhost:3030/user/getAllUser', function (error, response, body) {
      })
      done();
    })

  })
})