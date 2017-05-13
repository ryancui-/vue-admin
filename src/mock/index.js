/**
 * Created by ryancui on 2017/5/13.
 */
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

const mock = new MockAdapter(axios);

mock.onPost('/authenticate').reply(200, {
  token: 'example-token'
})

mock.onPost('/logout').reply(200)

mock.onGet('/auth/user').reply(200, {
  name: 'Alice'
})

mock.onGet('/auth/menu').reply(200, [
  {
    index: '/demo',
    name: 'Demo',
    children: [{
      index: '/demo1',
      name: 'demo1'
    }, {
      index: '/demo2',
      name: 'demo2'
    }]
  }
])