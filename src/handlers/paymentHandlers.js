const { ACCESS_TOKEN, RETURN_URL } = process.env;
const { User } = require("../db.js");
const mercadopago = require("mercadopago");
const axios = require('axios');

const postPaymentHandler = async (req, res) => {
  const { items, seller_id } = req.body;
  const seller = await User.findByPk(seller_id);
  
  mercadopago.configure({
    access_token: ACCESS_TOKEN,
  });
  let preference = {
    back_urls: {
      success: RETURN_URL,
      failure: RETURN_URL,
      pending: RETURN_URL,
    },
    auto_return: "approved",
    items: [],
  };
  items.forEach((item) => {
    preference.items.push(item);
  });
  try {
    // Enviar solicitud de preferencia
    mercadopago.preferences
      .create(preference)
      .then(function (response) {
        res.json({
          global: response.body,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}; 

const getAuthCode = async (req,res) => {
  const { code, state } = req.query;
  try {
    await axios
      .post(
        "https://api.mercadopago.com/oauth/token",
        {
          client_secret: ACCESS_TOKEN,
          client_id: ACCESS_TOKEN,
          grant_type: "authorization_code",
          code: code,
          redirect_uri: RETURN_URL 
        },
        {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        User.update({ 
          MPAccessToken : response.data.access_token,
          MPUserId : response.data.user_id,
          MPRefreshToken : response.data.refresh_token,
          MPExpiresIn : response.data.expires_in
        },{
          where: {
            id: state
          }
        })
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        res.redirect('https://my-seam-chi.vercel.app/');
      })
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { postPaymentHandler, getAuthCode };
