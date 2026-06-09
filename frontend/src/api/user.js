/**
 * user.js - 用户资料 API
 */

import request from './request'

export const getCurrentUser = () => request.get('/users/me')

export const updateProfile = (data) => request.put('/users/me', data)

export const changePassword = (data) => request.post('/users/me/password', data)
