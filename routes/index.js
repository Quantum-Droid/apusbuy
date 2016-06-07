
/*
 * GET home page.
 */

 'use strict';

const express    = require('express');
const router     = express.Router();


module.exports = router;


router.get('/', (req, res) => {
	console.log('root ._.');  
  res.render('index');
});

