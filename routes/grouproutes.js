const express = require('express')
const {Get_Group,Create_Group,Add_To_Group,Get_All_Groups,Invite_To_Group} = require('../controllers/group')

const router = express.Router()
const Auth = require('../middleware/Auth')

router.use(Auth)
router.get('/all',Get_Group)
router.post('/create',Create_Group)
router.post('/add/:id',Add_To_Group)
router.post('/all-groups',Get_All_Groups)
router.post('/invite',Invite_To_Group)


module.exports = router