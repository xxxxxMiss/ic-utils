const UA = navigator.userAgent

export const isIOS = /\(i[^;]+;( U;)? CPU.+Mac OS X/i.test(UA)

export const isAndroid = /Android|Adr/i.test(UA)

export const isWechat = /MicroMessenger/i.test(UA)

export const isMobile = /Mobile/i.test(UA)
