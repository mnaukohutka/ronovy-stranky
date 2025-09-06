import createAuth0Client from 'https://cdn.skypack.dev/@auth0/auth0-spa-js'

const auth0Config = {
  domain: 'ronovys.eu.auth0.com',
  clientId: 'PIsBVcJ5HbQA1S2ob3vdNOTGhtdP6z4K',
  redirectUri: window.location.origin
}

export let auth0Client = null

export const initAuth0 = async () => {
  auth0Client = await createAuth0Client(auth0Config)
  return auth0Client
}
