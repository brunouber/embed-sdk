/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019 Looker Data Sciences, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import { LookerEmbedDashboard } from '../src/dashboard_client'
import { EmbedClient } from '../src/embed'
import { LookerEmbedExplore } from '../src/explore_client'
import { LookerEmbedSDK } from '../src/index'
import { LookerEmbedLook } from '../src/look_client'

describe('LookerEmbedBuilder', () => {
  let builder
  let el

  beforeEach(() => {
    LookerEmbedSDK.init('host.looker.com:9999', '/auth')
    el = document.createElement('div')
    el.id = 'the-element'
    document.body.append(el)
  })

  afterEach(() => {
    document.body.removeChild(el)
  })

  describe('dashboards with ID', () => {
    beforeEach(() => {
      builder = LookerEmbedSDK.createDashboardWithId(11)
    })

    it('should create a dashboard instance', () => {
      expect(builder.type).toEqual('dashboard')
      expect(builder.clientConstructor).toEqual(LookerEmbedDashboard)
    })

    it('should generate a dashboard URL', () => {
      expect(builder.embedUrl).toMatch('https://host.looker.com:9999/embed/dashboards/11')
    })
  })

  describe('dashboards with URL', () => {
    beforeEach(() => {
      builder = LookerEmbedSDK.createDashboardWithUrl('https://host.looker.com:9999/login/embed/etc')
    })

    it('should create a dashboard instance', () => {
      expect(builder.type).toEqual('dashboard')
      expect(builder.clientConstructor).toEqual(LookerEmbedDashboard)
    })

    it('should return the URL', () => {
      expect(builder.url).toEqual('https://host.looker.com:9999/login/embed/etc')
    })
  })

  describe('looks with ID', () => {
    beforeEach(() => {
      builder = LookerEmbedSDK.createLookWithId(11)
    })

    it('should create a look instance', () => {
      expect(builder.type).toEqual('look')
      expect(builder.clientConstructor).toEqual(LookerEmbedLook)
    })

    it('should generate a look URL', () => {
      expect(builder.embedUrl).toMatch('https://host.looker.com:9999/embed/looks/11')
    })
  })

  describe('looks with URL', () => {
    beforeEach(() => {
      builder = LookerEmbedSDK.createLookWithUrl('https://host.looker.com:9999/login/embed/etc')
    })

    it('should create a look instance', () => {
      expect(builder.type).toEqual('look')
      expect(builder.clientConstructor).toEqual(LookerEmbedLook)
    })

    it('should generate a look URL', () => {
      expect(builder.url).toEqual('https://host.looker.com:9999/login/embed/etc')
    })
  })

  describe('explores with ID', () => {
    beforeEach(() => {
      builder = LookerEmbedSDK.createExploreWithId('alpha:beta')
    })

    it('should create an explore instance', () => {
      expect(builder.type).toEqual('explore')
      expect(builder.clientConstructor).toEqual(LookerEmbedExplore)
    })

    it('should generate a look URL', () => {
      expect(builder.embedUrl).toMatch('https://host.looker.com:9999/embed/explores/alpha:beta')
    })
  })

  describe('explores with URL', () => {
    beforeEach(() => {
      builder = LookerEmbedSDK.createExploreWithUrl('https://host.looker.com:9999/login/embed/etc')
    })

    it('should create an explore instance', () => {
      expect(builder.type).toEqual('explore')
      expect(builder.clientConstructor).toEqual(LookerEmbedExplore)
    })

    it('should generate a look URL', () => {
      expect(builder.url).toEqual('https://host.looker.com:9999/login/embed/etc')
    })
  })

  describe('parameters', () => {
    beforeEach(() => {
      builder = LookerEmbedSDK.createDashboardWithId(11)
    })

    it('should add an on<action> handler', () => {
      const dance = jasmine.createSpy('dance')
      builder.on('party', dance)
      expect(builder.handlers.party).toEqual([dance])
    })

    it('should add url parameters', () => {
      builder.withParams({ alpha: 1, beta: 2 })
      expect(builder.embedUrl).toMatch('alpha=1&beta=2')
    })

    it('should allow adding sandbox attributes', () => {
      builder.withSandboxAttr('alpha')
      builder.withSandboxAttr('beta')
      expect(builder.sandboxAttrs).toEqual(['alpha', 'beta'])
    })

    it('should allow adding several sandbox attributes at once', () => {
      builder.withSandboxAttr('alpha', 'beta')
      expect(builder.sandboxAttrs).toEqual(['alpha', 'beta'])
    })

    it('should allow adding classNames', () => {
      builder.withClassName('alpha')
      builder.withClassName('beta')
      expect(builder.classNames).toEqual(['alpha', 'beta'])
    })

    it('should allow adding several classNames attributes at once', () => {
      builder.withClassName('alpha', 'beta')
      expect(builder.classNames).toEqual(['alpha', 'beta'])
    })

    it('should default to appending to body', () => {
      expect(builder.el).toEqual(document.body)
    })

    it('should allow selecting an element', () => {
      builder.appendTo('#the-element')
      expect(builder.el).toEqual(el)
    })

    it('should allow specifying an element', () => {
      builder.appendTo(el)
      expect(builder.el).toEqual(el)
    })

    it('should default to no frame border', () => {
      expect(builder.frameBorder).toEqual('0')
    })

    it('should allow setting frame border', () => {
      builder.withFrameBorder('1')
      expect(builder.frameBorder).toEqual('1')
    })

    it('should return the api host', () => {
      expect(builder.apiHost).toEqual('host.looker.com:9999')
    })

    it('should return the auth url', () => {
      expect(builder.authUrl).toEqual('/auth')
    })
  })

  describe('build', () => {
    beforeEach(() => {
      builder = LookerEmbedSDK.createDashboardWithId(11)
    })

    it('should create an iframe with the correct attributes and return an embed client', () => {
      const embed = builder.build()
      expect(embed).toEqual(jasmine.any(EmbedClient))
    })
  })
})