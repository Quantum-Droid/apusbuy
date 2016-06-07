/*
 * Serve JSON to our AngularJS client
 */

'use strict';

const express    = require('express');
const router     = express.Router();

module.exports = router;

//Test
router.get('/', (req, res) => {	
  res.json({
    name: 'Bob'
  });
});