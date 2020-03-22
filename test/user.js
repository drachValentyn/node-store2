process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const User = require('../controllers/models/User');
const Admin = require('../controllers/models/Admin');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
let should = chai.should();
let expect = chai.expect;

chai.use(chaiHttp);

let login_details = {
  'username': 'mevn-admin',
  'password': '123456'
};

let register_details = {
  'username': 'mevn-admin',
  'password': '123456'
};

let token = '';

/**
 * Test the following in on scoop:
 * - Create an account, login with details, and check if token comes
 */

describe('Create Account, Login and Check Token', () => {
  beforeEach((done) => {
    // Reset user mode before each test
    Admin.remove({}, (err) => {
      console.log(err);
      done();
    })
  });

  describe('/POST Register', () => {
    it('it should Register, Login, and check token', (done) => {
      chai.request(server)
        .post('/api/auth/register')
        .send(register_details) //sending $http.post
        .end((err, res) => { // when we get a response from the endpoint
          res.should.have.status(200);
          expect(res.body.success).to.be.true;

          chai.request(server)
            .post('/api/auth/login')
            .send(login_details)
            .end((err, res) => {
              console.log('this was run the login part');
              res.should.have.status(200);
              expect(res.body.success).to.be.true;
              res.body.should.have.property('token');

              token = res.body.token;

              describe('/GET all user', () => {
                chai.request(server)
                  .get('/user')
                  //set the auth header with our token
                  .set('authorization', token)
                  .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('array');
                    done(); // Don't forget the done callback to indicate we're done!
                  });
              });

              describe('/POST add new user', () => {
                it('it should POST a user', (done) => {
                  let user = {
                    'name': 'The Lord of the Rings',
                    'login': 'J.R.R. Tolkien',
                    'email': 'tolkien@mail.com'
                  };
                  chai.request(server)
                    .post('/user')
                    //set the auth header with our token
                    .set('authorization', token)
                    .send(user)
                    .end((err, res) => {
                      res.should.have.status(200);
                      res.body.should.be.an('object');
                      done(); // Don't forget the done callback to indicate we're done!
                    });
                });
            });



              describe('/GET/:id book', () => {
                it('it should GET a user by the given id', (done) => {
                  let user = new User({ name: "The Lord of the Rings", login: 'J.R.R. Tolkien', email: "tolkien@mail.com" });
                  user.save((err, user) => {
                    chai.request(server)
                      .get('/user/' + user.id)
                      .set('authorization', token)
                      .send(user)
                      .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('name');
                        res.body.should.have.property('login');
                        res.body.should.have.property('email');
                        res.body.should.have.property('_id').eql(user.id);
                        done();
                      });
                  });

                });
              });


              describe('/PUT/:id user', () => {
                it('it should UPDATE a user given the id', (done) => {
                  let user = new User({ name: "frodo", login: 'frodologin', email: "frodo@mail.com" });
                  user.save((err, user) => {
                    chai.request(server)
                      .put('/user/' + user.id)
                      .set('authorization', token)
                      .send({ name: "frodo", login: 'frodologin_2', email: "frodo@mail.com" })
                      .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('User updated!');
                        res.body.post.should.have.property('login').eql("frodologin_2");
                        done();
                      });
                  });
                });
              });


              describe('/DELETE/:id user', () => {
                it('it should DELETE a user given the id', (done) => {
                  let user = new User({ name: "frodo_change1", login: 'frodologin', email: "frodo@mail.com" });
                  user.save((err, user) => {
                    chai.request(server)
                      .delete('/user/' + user.id)
                      .set('authorization', token)
                      .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('User successfully deleted!');
                        done();
                      });
                  });
                });
              });

        })
    })
  });


  });



});




