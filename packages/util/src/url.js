import { isIE } from './env'

export function isAbsoluteUrl (url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z0-9+-.]*:)?\/\//i.test(url)
}

export function resolveUrl (url) {
  const aNode = document.createElement('a')
  let href = url

  if (msie) {
    // IE needs attribute set twice to normalize properties
    aNode.setAttribute('href', href)
    href = aNode.href
  }

  aNode.setAttribute('href', href)

  // aNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
  return {
    href: aNode.href,
    protocol: aNode.protocol || '',
    host: aNode.host,
    hostname: aNode.hostname,
    port: aNode.port,
    search: aNode.search || '',
    hash: aNode.hash || '',
    pathname: (aNode.pathname.charAt(0) === '/')
      ? aNode.pathname
      : '/' + aNode.pathname
  }
}
