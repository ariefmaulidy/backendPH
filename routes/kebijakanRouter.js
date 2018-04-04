var express = require('express'),
    router = express.Router(),
    Kebijakan = require('./../controllers/kebijakanController');

router.get('', (req, res, next) => {
    Kebijakan.GetAllKebijakan(req, res);
});

router.get('/:id', (req, res, next) => {
    Kebijakan.GetOneKebijakan(req, res);
})

router.post('', (req, res, next) => {
    Kebijakan.CreateNewKebijakan(req, res);
});

router.post('/broadcast/:id', (req, res, next) => {
    Kebijakan.BroadcastKebijakan(req, res);
});

router.delete('/:id', (req, res, next) => {
    Kebijakan.DeleteKebijakan(req, res);
});

module.exports = router;