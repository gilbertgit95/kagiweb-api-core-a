import express from 'express'

// import {AppRequest } from '../utilities/globalTypes'
import Config from '../utilities/config'
import routerIdentity from '../utilities/routerIdentity'
// import ErrorHandler from '../utilities/errorHandler'
// import authController from '../controllers/authController'
import OwnerOnlyMiddleware from '../middlewares/ownerOnlyMiddleware'

// import { IUser } from '../dataSource/models/userModel'

const env = Config.getEnv()
const router = express.Router()

// route to fetch the owner data of the current signed in user
router.get(env.RootApiEndpoint + 'owner', OwnerOnlyMiddleware, async (req, res) => {

    return res.json({})
})

// routes for owner user info
router.get(env.RootApiEndpoint + 'owner/userInfo', OwnerOnlyMiddleware, async (req, res) => {
    return res.json({})
})
router.post(env.RootApiEndpoint + 'owner/userInfo', OwnerOnlyMiddleware, async (req, res) => {
    return res.json({})
})
router.get(env.RootApiEndpoint + 'owner/userInfo/:id', OwnerOnlyMiddleware, async (req, res) => {
    return res.json({})
})
router.put(env.RootApiEndpoint + 'owner/userInfo/:id', OwnerOnlyMiddleware, async (req, res) => {
    return res.json({})
})
router.delete(env.RootApiEndpoint + 'owner/userInfo/:id', OwnerOnlyMiddleware, async (req, res) => {
    return res.json({})
})

// routes for owner contact info
router.get(env.RootApiEndpoint + 'owner/contactInfo', OwnerOnlyMiddleware, async (req, res) => {
    return res.json({})
})
router.post(env.RootApiEndpoint + 'owner/contactInfo', OwnerOnlyMiddleware, async (req, res) => {
    return res.json({})
})
router.get(env.RootApiEndpoint + 'owner/contactInfo/:id', OwnerOnlyMiddleware, async (req, res) => {
    return res.json({})
})
router.put(env.RootApiEndpoint + 'owner/contactInfo/:id', OwnerOnlyMiddleware, async (req, res) => {
    return res.json({})
})
router.delete(env.RootApiEndpoint + 'owner/contactInfo/:id', OwnerOnlyMiddleware, async (req, res) => {
    return res.json({})
})

// routes for owner roles
router.get(env.RootApiEndpoint + 'owner/roles', OwnerOnlyMiddleware, async (req, res) => {
    return res.json({})
})
router.post(env.RootApiEndpoint + 'owner/roles', OwnerOnlyMiddleware, async (req, res) => {
    return res.json({})
})
router.get(env.RootApiEndpoint + 'owner/roles/:id', OwnerOnlyMiddleware, async (req, res) => {
    return res.json({})
})
router.put(env.RootApiEndpoint + 'owner/roles/:id', OwnerOnlyMiddleware, async (req, res) => {
    return res.json({})
})
router.delete(env.RootApiEndpoint + 'owner/roles/:id', OwnerOnlyMiddleware, async (req, res) => {
    return res.json({})
})

// routes for owner passwords
router.get(env.RootApiEndpoint + 'owner/passwords', OwnerOnlyMiddleware, async (req, res) => {
    return res.json({})
})
router.post(env.RootApiEndpoint + 'owner/passwords', OwnerOnlyMiddleware, async (req, res) => {
    return res.json({})
})
router.get(env.RootApiEndpoint + 'owner/passwords/:id', OwnerOnlyMiddleware, async (req, res) => {
    return res.json({})
})
router.put(env.RootApiEndpoint + 'owner/passwords/:id', OwnerOnlyMiddleware, async (req, res) => {
    return res.json({})
})
router.delete(env.RootApiEndpoint + 'owner/passwords/:id', OwnerOnlyMiddleware, async (req, res) => {
    return res.json({})
})

// routes for owner limited transactions
router.get(env.RootApiEndpoint + 'owner/limitedTransactions', OwnerOnlyMiddleware, async (req, res) => {
    return res.json({})
})
router.post(env.RootApiEndpoint + 'owner/limitedTransactions', OwnerOnlyMiddleware, async (req, res) => {
    return res.json({})
})
router.get(env.RootApiEndpoint + 'owner/limitedTransactions/:id', OwnerOnlyMiddleware, async (req, res) => {
    return res.json({})
})
router.put(env.RootApiEndpoint + 'owner/limitedTransactions/:id', OwnerOnlyMiddleware, async (req, res) => {
    return res.json({})
})
router.delete(env.RootApiEndpoint + 'owner/limitedTransactions/:id', OwnerOnlyMiddleware, async (req, res) => {
    return res.json({})
})

// routes for owner devices
router.get(env.RootApiEndpoint + 'owner/devices', OwnerOnlyMiddleware, async (req, res) => {
    return res.json({})
})
router.post(env.RootApiEndpoint + 'owner/devices', OwnerOnlyMiddleware, async (req, res) => {
    return res.json({})
})
router.get(env.RootApiEndpoint + 'owner/devices/:id', OwnerOnlyMiddleware, async (req, res) => {
    return res.json({})
})
router.put(env.RootApiEndpoint + 'owner/devices/:id', OwnerOnlyMiddleware, async (req, res) => {
    return res.json({})
})
router.delete(env.RootApiEndpoint + 'owner/devices/:id', OwnerOnlyMiddleware, async (req, res) => {
    return res.json({})
})

// routes for owner device access token
router.get(env.RootApiEndpoint + 'owner/devices/:deviceId/tokens', OwnerOnlyMiddleware, async (req, res) => {
    return res.json({})
})
router.post(env.RootApiEndpoint + 'owner/devices/:deviceId/tokens', OwnerOnlyMiddleware, async (req, res) => {
    return res.json({})
})
router.get(env.RootApiEndpoint + 'owner/devices/:deviceId/tokens/:tokenId', OwnerOnlyMiddleware, async (req, res) => {
    return res.json({})
})
router.put(env.RootApiEndpoint + 'owner/devices/:deviceId/tokens/:tokenId', OwnerOnlyMiddleware, async (req, res) => {
    return res.json({})
})
router.delete(env.RootApiEndpoint + 'owner/devices/:deviceId/tokens/:tokenId', OwnerOnlyMiddleware, async (req, res) => {
    return res.json({})
})

routerIdentity.addAppRouteObj(router)
export default router