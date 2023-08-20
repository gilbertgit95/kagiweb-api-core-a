import express from 'express'

// import {AppRequest } from '../utilities/globalTypes'
import Config from '../utilities/config'
import routerIdentity from '../utilities/routerIdentity'
// import ErrorHandler from '../utilities/errorHandler'
// import authController from '../controllers/authController'

// import { IUser } from '../dataSource/models/userModel'

const env = Config.getEnv()
const router = express.Router()

// route to fetch the owner data of the current signed in user
router.get(env.RootApiEndpoint + 'owner', async (req, res) => {

    return res.json({})
})

// routes for owner user info
router.get(env.RootApiEndpoint + 'owner/userInfo', async (req, res) => {
    return res.json({})
})
router.post(env.RootApiEndpoint + 'owner/userInfo', async (req, res) => {
    return res.json({})
})
router.get(env.RootApiEndpoint + 'owner/userInfo/:id', async (req, res) => {
    return res.json({})
})
router.put(env.RootApiEndpoint + 'owner/userInfo/:id', async (req, res) => {
    return res.json({})
})
router.delete(env.RootApiEndpoint + 'owner/userInfo/:id', async (req, res) => {
    return res.json({})
})

// routes for owner contact info
router.get(env.RootApiEndpoint + 'owner/contactInfo', async (req, res) => {
    return res.json({})
})
router.post(env.RootApiEndpoint + 'owner/contactInfo', async (req, res) => {
    return res.json({})
})
router.get(env.RootApiEndpoint + 'owner/contactInfo/:id', async (req, res) => {
    return res.json({})
})
router.put(env.RootApiEndpoint + 'owner/contactInfo/:id', async (req, res) => {
    return res.json({})
})
router.delete(env.RootApiEndpoint + 'owner/contactInfo/:id', async (req, res) => {
    return res.json({})
})

// routes for owner roles
router.get(env.RootApiEndpoint + 'owner/roles', async (req, res) => {
    return res.json({})
})
router.post(env.RootApiEndpoint + 'owner/roles', async (req, res) => {
    return res.json({})
})
router.get(env.RootApiEndpoint + 'owner/roles/:id', async (req, res) => {
    return res.json({})
})
router.put(env.RootApiEndpoint + 'owner/roles/:id', async (req, res) => {
    return res.json({})
})
router.delete(env.RootApiEndpoint + 'owner/roles/:id', async (req, res) => {
    return res.json({})
})

// routes for owner passwords
router.get(env.RootApiEndpoint + 'owner/passwords', async (req, res) => {
    return res.json({})
})
router.post(env.RootApiEndpoint + 'owner/passwords', async (req, res) => {
    return res.json({})
})
router.get(env.RootApiEndpoint + 'owner/passwords/:id', async (req, res) => {
    return res.json({})
})
router.put(env.RootApiEndpoint + 'owner/passwords/:id', async (req, res) => {
    return res.json({})
})
router.delete(env.RootApiEndpoint + 'owner/passwords/:id', async (req, res) => {
    return res.json({})
})

// routes for owner limited transactions
router.get(env.RootApiEndpoint + 'owner/limitedTransactions', async (req, res) => {
    return res.json({})
})
router.post(env.RootApiEndpoint + 'owner/limitedTransactions', async (req, res) => {
    return res.json({})
})
router.get(env.RootApiEndpoint + 'owner/limitedTransactions/:id', async (req, res) => {
    return res.json({})
})
router.put(env.RootApiEndpoint + 'owner/limitedTransactions/:id', async (req, res) => {
    return res.json({})
})
router.delete(env.RootApiEndpoint + 'owner/limitedTransactions/:id', async (req, res) => {
    return res.json({})
})

// routes for owner devices
router.get(env.RootApiEndpoint + 'owner/devices', async (req, res) => {
    return res.json({})
})
router.post(env.RootApiEndpoint + 'owner/devices', async (req, res) => {
    return res.json({})
})
router.get(env.RootApiEndpoint + 'owner/devices/:id', async (req, res) => {
    return res.json({})
})
router.put(env.RootApiEndpoint + 'owner/devices/:id', async (req, res) => {
    return res.json({})
})
router.delete(env.RootApiEndpoint + 'owner/devices/:id', async (req, res) => {
    return res.json({})
})

// routes for owner device access token
router.get(env.RootApiEndpoint + 'owner/devices/:deviceId/tokens', async (req, res) => {
    return res.json({})
})
router.post(env.RootApiEndpoint + 'owner/devices/:deviceId/tokens', async (req, res) => {
    return res.json({})
})
router.get(env.RootApiEndpoint + 'owner/devices/:deviceId/tokens/:tokenId', async (req, res) => {
    return res.json({})
})
router.put(env.RootApiEndpoint + 'owner/devices/:deviceId/tokens/:tokenId', async (req, res) => {
    return res.json({})
})
router.delete(env.RootApiEndpoint + 'owner/devices/:deviceId/tokens/:tokenId', async (req, res) => {
    return res.json({})
})

routerIdentity.addAppRouteObj(router)
export default router