const express = require('express'); 
const faq = require('../Controller/faqController');


const router = express();


router.post('/', [  faq.createFaq]);
router.get('/', [  faq.getAllFaq]);
router.put('/:id',[ faq.updateFaq]);
router.delete('/:id',[  faq.deleteFaq]);

module.exports = router;