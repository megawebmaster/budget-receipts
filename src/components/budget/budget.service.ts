import { AppAction, noop } from '../../app.actions'
import { AppMessageType } from '../message-list'
import { BudgetEntry } from './budget-entry.types'
import { updateEntries } from './budget.actions'
import { pageError } from '../page'

const budgetEntries = [{
  'id': 411,
  'budgetYear': { 'id': 7, 'budget': [] },
  'category': { 'id': 4, 'type': 'income' },
  'month': 1,
  'plan': 'wy4ECQMIxU5t5NmZ\/pdgndDbVs3VxxoL5iQZciE+tyKFskbLRNpH0xAH4h+dWhH00j8BT0uS4H9rWsv6RT0fUcgPUKcVkefmxOuYX300l+31vBtGI\/JSXsQqZywid4k355CimlHsbAtplTpcFYbkfVQ=',
  'real': 'wy4ECQMI0gNPW9hH1H1glClbY54qK9L0uMg+gWqo+jpX+eWumYlqBmeDeL5dSuX60j8BnWfCNgtU3i+iUQZ8aXv2AOy2zJZBBHyKX7ZoWbhvI1tCziRGr06M8qA80bQh91ylmLfsLcigBTJTXlwCqqw=',
  'monthlyRealValues': [],
}, {
  'id': 413,
  'budgetYear': { 'id': 7, 'budget': [] },
  'category': { 'id': 1, 'type': 'income' },
  'month': 1,
  'plan': 'wy4ECQMIceLeBQKgvzlgq3tU9lHoYMGRR47M3h6UdpiBJHdf4gqvWnN\/X4Iszizo0kABDtIRq+sXl1sxqUdNm4xxivrnrxCSVvn\/gbsK1sRerakzV2QLto5CXmxXbBkis9RW7QX64+NjXZvsJ47UeoEM',
  'real': 'wy4ECQMIPi3\/5tvdYlhgDmfQLJohnrArTqYM41yP5mIqaOFzYNdoOL6vugY0f7OQ0kABn2mkC4TxcXpsZkL8c+jKIPWpkP+NNV8t8\/tHpSh82G0t8oQCH8g5eDepyYHIY7t+dt5\/9DzCgeKhWSTiwUdB',
  'monthlyRealValues': [],
}, {
  'id': 414,
  'budgetYear': { 'id': 7, 'budget': [] },
  'category': { 'id': 15, 'type': 'expense' },
  'month': 1,
  'plan': 'wy4ECQMI4uG1OkTX7AZgwUJoQEcX2O4KW4IWBuODGMP+kzUtRrIwjJ0oiN+humJC0jkBBUFbArVW7kRs0g+tcUS9\/OVxB9L6JFplUhQz5Mi9zAOZQW0qm8AuTOEr8pZ6LtD+05fiFSEaqpw=',
  'real': 'wy4ECQMIg+NuokTxHZNgJ5E1EIxAVl06pEKz8HBFGlGb6ChE8oHnIUsvOdZr1K4E0kkBGrP1adMulSL4R3PPWIsyCNzE12Z8jOtGfRyJQ50dQsaevFg4H6P9rlOtTth21r0OyQIES+GEpdb7CJuEFPkCUK+Ru8e7Z+7g',
  'monthlyRealValues': [],
}, {
  'id': 415,
  'budgetYear': { 'id': 7, 'budget': [] },
  'category': { 'id': 16, 'type': 'expense' },
  'month': 1,
  'plan': 'wy4ECQMIJgCRyokat4tgQ7mpZD1ulYnVkCBg\/BEYcetZSiQZAWFFfSGL18\/y3L7L0jkBfDHw0VQMBL25XkVsQhI4bfOgsOHmW1v6hTeG8\/H7sm2xSy7xi5pTaSN5TBe4OO1i3fWxlyYjzBs=',
  'real': 'wy4ECQMISUyWuNS+965gjv8rLriSRODky4ZidKB6DpHuJsNgUc\/twiJYOp8xzYPF0koBQWZtJeKFpwrgSuUJQRbs4fICVuwLL0Y0O0x+WQ6t\/METsDUUV\/xp4fUartMhQpN+ZfrMzyPUDQMBsNtVfdq+rrkqMsmIh8wcAg==',
  'monthlyRealValues': [],
}, {
  'id': 416,
  'budgetYear': { 'id': 7, 'budget': [] },
  'category': { 'id': 17, 'type': 'expense' },
  'month': 1,
  'plan': 'wy4ECQMI1Y6HpQR9iqVgoBs2uzPHLGsh24hkzsSfQcp4pDz9Z3t9gFUsTxLvbN1e0jkBUkGUioxWFUimiSk1\/49YSy\/GT3bjCvzc85eeoJTvMVDVtpTTXrsW7ntSXFpH2TVGxpqgofYB8pw=',
  'real': 'wy4ECQMIOtiV4jR884lgdrdo9gWqaokXfSjpZj4RkjOR3UMXBW\/QUN4p5K9fvFlx0j4B8zNwdHSQUV4ekg0sDrRHyAeDQwI0+vMvFdgjeCYjqgsdNPVKUPjyZzQyF2GdGoIAPXJgh3EX7n3XGGXt+g==',
  'monthlyRealValues': [],
}, {
  'id': 417,
  'budgetYear': { 'id': 7, 'budget': [] },
  'category': { 'id': 18, 'type': 'expense' },
  'month': 1,
  'plan': 'wy4ECQMIGcogEGJ8QW9grjCeyFLn8A5FJtnYHWx\/nTvBVqLkrCh9M342\/90MlGg80jkBYQGbfwfBHNgfJgursXCUQW+Jk6lnkcW5a8t3mZjneL7UczW19cNLhlz6dUOnp2yZTKHZo7IvAz8=',
  'real': 'wy4ECQMIKu7RGS40OVFgevIxdjZ8+bqxG9CbmHqbhSQ5EAszW7RkOzSP\/UlmD7as0j4BR0+I\/\/ce9AWwC3NIMz34MF\/vscEpzwSn3SEWNhfjS19bGdYppkRNF40GhqQ3vZxRMwHDioVB91OwIoOIvw==',
  'monthlyRealValues': [],
}, {
  'id': 418,
  'budgetYear': { 'id': 7, 'budget': [] },
  'category': { 'id': 19, 'type': 'expense' },
  'month': 1,
  'plan': 'wy4ECQMIZxJ05zZN4Zhgbat0v5YKQcOm1V3oPe4UVzfLkuNsYBUS79WxXANXQRLE0jkBfROIdvKVrKOq06etns3EzCoHtXeMwPbxEUru\/QHuWzy2GTAn+X6FuyeHndkwDrHUPVINDqetGxs=',
  'real': 'wy4ECQMI9AnBFsrOQW1g6V5qB7Q0wBge7KU+MM2ESw+76UyRTVjdmusLQ8bh\/kbO0kkBP5J\/SesiQF2NSr8nRl9M0X9J4oUNW4Wz1JjdHQYyU7W7CSEtUc0Fdc1PYsuH5k9PMpmYcep71Vl6oPS5668x5NJ2XZkn79qR',
  'monthlyRealValues': [],
}, {
  'id': 419,
  'budgetYear': { 'id': 7, 'budget': [] },
  'category': { 'id': 20, 'type': 'expense' },
  'month': 1,
  'plan': 'wy4ECQMIaQ\/\/HOFFY+1gx7IIYP2o1R8sgOjS5T28G9FVjj2fAxuKSjLN5omqJE2O0jkBZ2Ehy4kotWmojI6uqZMfzJTey6WUMVgNcXts+KyUCKu7sigIqFa\/G\/REhrqfx21RywMKJZDCoE8=',
  'real': 'wy4ECQMI1r9ttFxIqqJgI8I6Cpg9M\/YX1G0HTr\/4nElMZROw+paE2c6Pwn9TKgt10j4BVCG2RPOp5iTbya4ybescvwPEXGe3ftaW9jiUZ4PB0eomy\/tmk5aTHiE\/eJD6ay70Hu7Amid2FRvfumiY0g==',
  'monthlyRealValues': [],
}, {
  'id': 420,
  'budgetYear': { 'id': 7, 'budget': [] },
  'category': { 'id': 21, 'type': 'expense' },
  'month': 1,
  'plan': 'wy4ECQMIcuSneK7qfXZgwrqxBk344avpH5ZS\/gsEliZSaj1LOgMWXrfbx+0Fspdw0jkBFqFmFywG8VkyNybPnLuMnDdrh2dVNf1oI+I\/x4ZIlS2rmVOfGg2DWE6cUPctS9o0q+SzVOp8QwY=',
  'real': 'wy4ECQMIK92wgPfBu0tg+NCkTOYhln9Iigo7wYgneopcOor\/ffbZSKUwXTH\/Ybcp0j4BwjG5+A8x9NE\/wnapbSDivfIbQ1Fvuk1ERJ2usZe1ezatVPZFwg9ELCGfmXy56hDpTZOF2l9uKdrVu+OckQ==',
  'monthlyRealValues': [],
}, {
  'id': 423,
  'budgetYear': { 'id': 7, 'budget': [] },
  'category': { 'id': 27, 'type': 'expense' },
  'month': 1,
  'plan': 'wy4ECQMI\/vOUeoelNQRgTKkrIQM84oJtH8qBbg\/avPSkUg49fbfQOmnstwopzxhp0jkB6KgsdO9+AMGdIPvUU45mPaKYNbyxTUDgvgF6LyE63t+RMKbh\/zz7cbZbmLh6U4LVUIbErCkaWa0=',
  'real': 'wy4ECQMIM2r6iG0uyMFgfxXWtku6TKGZT02YspCD8fGLfloV3eq8QWiPYR+m8Gl80j0BiQQRwu+aOBaNT6I8GWygAhw9STp4Wh8end5jULm1cUH\/qSXZ2hFH8Y5jgmtTI\/AfDjkuvBAEI7VOQsR\/',
  'monthlyRealValues': [],
}, {
  'id': 424,
  'budgetYear': { 'id': 7, 'budget': [] },
  'category': { 'id': 26, 'type': 'expense' },
  'month': 1,
  'plan': 'wy4ECQMId4\/9Q3Pfb11gN9TyKTlRw08cx8vySeYb4tG5CYBe2mKBxgqNMcptvi1b0jkBD50nXNLpqVQrbm4j1DER+d94CtmzYmfIzxzFssop6uLeX6M8fuWEzbFLAuRbYpOUTcngmPLyDI0=',
  'real': 'wy4ECQMIkt+kijqqeDhgq6j7FOCBBVTnC+n6h\/\/pxlJ2wjb5Ipv79GRKCviEhZUN0joBTzfTVKGfrhBsrhydVcCQAM8nJDWFKledaiajNH1R2INyCY0HD0t\/PIcdq8gPCVJ82QWTnlbLZnPh',
  'monthlyRealValues': [],
}, {
  'id': 425,
  'budgetYear': { 'id': 7, 'budget': [] },
  'category': { 'id': 25, 'type': 'expense' },
  'month': 1,
  'plan': 'wy4ECQMIFJFw72K7\/yxgh92vxDLd3ccxobnX2onBUWM2ScvngjinHkeEbUL3YaFY0jkBnWgqmN5Y2QcOdzbELGw69vBWaG0FYM0IyDFuS2srOWAVGTWVwghXcQmr6srcV55VwuZswhNFPfQ=',
  'real': 'wy4ECQMIsI5RVsA8GhdgUgSCJPuz8OED0dg38hriKMVhL9FLGsFptqDZ\/KE+8zuI0jsBiwkmgkXZTKyhJpxpZGzvNHAkeNgUTCeMwxgJcVH\/ZNa5uAtKyFebDzwTyjP7nK8ujMzU9QU1KQG5cw==',
  'monthlyRealValues': [],
}, {
  'id': 426,
  'budgetYear': { 'id': 7, 'budget': [] },
  'category': { 'id': 24, 'type': 'expense' },
  'month': 1,
  'plan': 'wy4ECQMI+LLtGusJccVgrU8lPp802QgyVIIV9QhLJeGbjLkg4cMg0H\/uJrcQonp40jkBQ94+7WwZUvBFf6XrktXAkvTKij9FNPsFQRKwxSY6VfI3N8acTTrVn7+RHdlJd\/CjwfmE+iELko0=',
  'real': 'wy4ECQMI6yC7egrdxc5gytBzHWUxgKLtZWQRZrowDt8sSgvrZ6H\/\/d\/iZf0qujXR0j4BmshZoFvaR52C6\/lugVSzVof3xHyuHzxvv0LQy9nxBfPtXtYv5hqAlGgpPZTFAqWuJQpwU7\/\/p22UhtfCVg==',
  'monthlyRealValues': [],
}, {
  'id': 427,
  'budgetYear': { 'id': 7, 'budget': [] },
  'category': { 'id': 28, 'type': 'expense' },
  'month': 1,
  'plan': 'wy4ECQMIokzliDL0uZtgDYbPpwBIZF3oMupOctRnmbKSSNfVG4vnDiqinXuQAyRO0jkBjNwRGtVkUJIYY2sNtusD7PyWr\/55xvgUBMyGuKf0NQvhvPGBMj+yhoObAvFBE36VBQZSnBgPGIc=',
  'real': '',
  'monthlyRealValues': [],
}, {
  'id': 428,
  'budgetYear': { 'id': 7, 'budget': [] },
  'category': { 'id': 29, 'type': 'expense' },
  'month': 1,
  'plan': 'wy4ECQMID\/JWXur1o\/tgqeASbkHbxTfUKtJbOrO3tocqog0Lt8kslqioUbAXaelg0jkB7yyq3oGLkany\/+YAecc0huDEF36G3MiUqmoiRHVbV6KSVjoaPbRbibOmwkxInZm8Z6wElp3l8n4=',
  'real': 'wy4ECQMIfzBoe80l5EhgjKebsWkdvQp2\/2hiHLh4P2SBPeumX7taz3nIQ4e0+V9n0j0Big4oL9iSYSR1mEQ\/bx5lskUSVCO1hKY8K1gxbVWMMs0HOJ7ca8fpyI6Bwnjv1jSG\/UEAZilQHmrnlllg',
  'monthlyRealValues': [],
}, {
  'id': 429,
  'budgetYear': { 'id': 7, 'budget': [] },
  'category': { 'id': 30, 'type': 'expense' },
  'month': 1,
  'plan': 'wy4ECQMI59QA2C++OApg2jPzRb1yseEFM\/LT\/dmMXEWNElI+AXeo8Mkaf+MSQkkD0jkBUD3jL2la8nPUa\/rnVtMzXRkZcvjMd8+Yd9NhpNu0Ey4jSseZLaBLLWLZqcBl5bYcnGA+ToCINvg=',
  'real': '',
  'monthlyRealValues': [],
}, {
  'id': 430,
  'budgetYear': { 'id': 7, 'budget': [] },
  'category': { 'id': 31, 'type': 'expense' },
  'month': 1,
  'plan': 'wy4ECQMId1UtZakMSIFgEoZUCXOSPh4ruTuirXIZYSWW\/ZprS61chE3tlcVCN3l70jkBC+VfSZ0BdBnZmFHlENSBBj3oLXZ7cwU0H4t4NfFzc+PBMKBLMOOhDHmnmBgH924h3X\/2NrdpKC4=',
  'real': '',
  'monthlyRealValues': [],
}, {
  'id': 431,
  'budgetYear': { 'id': 7, 'budget': [] },
  'category': { 'id': 32, 'type': 'expense' },
  'month': 1,
  'plan': 'wy4ECQMIuzwIOUfNbyZgMZRnea\/csV3rk\/ZolFjuEx29lnZ\/RtDx6na32\/lKA0jI0jkBtCrw9QIxjwiBXs0DonLDFdV3W\/4RLqlY+6HNVkBoKcpTRoFTqO3UKpqSt6WnY8I3t88BdOYPtUk=',
  'real': 'wy4ECQMIk020F79Ka3NgFTRct5KVwouP\/lcYGAXqrr2tFuWfJEQe8Nmb27eClglm0j0BVWAehkoXNKfTomc+Wm0b4Xgz2\/LQOug0h8L\/BqQEBGWE8jC+iVpWXy76aTkCEhRW8Fff42tednbG9e4E',
  'monthlyRealValues': [],
}, {
  'id': 432,
  'budgetYear': { 'id': 7, 'budget': [] },
  'category': { 'id': 33, 'type': 'expense' },
  'month': 1,
  'plan': 'wy4ECQMIVY1g4BSFDwlgVhecUFskWiYmggtPdtAYRItmWzOc57tF8Hkjdv\/Lu4JX0jkBIMUlvQKucv4Zvlx86+wqn30NwvLhFdm+wIhO2Wh1ud7ZOC1mzjzWX8sfE3ldcQzSqVlYNcuL45w=',
  'real': 'wy4ECQMIs7Ag4i+WQHNgG25WTcB750qck691GKdN0R3stw71M90JpSDAYRkKPDjO0j0B07K1ZUdr+Yw2\/h6mPMaD0ZAeurwbIlFiyKb\/ypQccp1HVErFhlirzMBzw4SRMst0OApZH6ik0PUEU2oJ',
  'monthlyRealValues': [],
}, {
  'id': 433,
  'budgetYear': { 'id': 7, 'budget': [] },
  'category': { 'id': 34, 'type': 'expense' },
  'month': 1,
  'plan': 'wy4ECQMIzSSW0FSClRNgqTKZ7okHnrjnpu3+eUPROYIF+9ssChBiuNgMKm+ckRfn0jkBxPc\/wz4+OhissuTW2LT6lr2X2jlYCN5JGbQrUpVNMPM6yOd+F6pa2wAJdWusMVY+1xfUQI1ojeM=',
  'real': 'wy4ECQMIiCqKcpXC425gYQnHdSrKN2hLpCpnXvGp9iG5G7Vr\/0ZRr8Rlwhq3DRP70j4BzLxaeBfHANmb5LpAHhTTE07Y4Ub2BBpxGjSJzAKiU6Hvh9A0C4JZoj94+ZklBX3o5ddNcocXbP0Jux0kAQ==',
  'monthlyRealValues': [],
}, {
  'id': 434,
  'budgetYear': { 'id': 7, 'budget': [] },
  'category': { 'id': 35, 'type': 'expense' },
  'month': 1,
  'plan': 'wy4ECQMIOzuaT9LBC2BgTOdjyF6oJcYHImDfiDdKytUljzIpKkDMSwsTjD49f4oZ0jkB\/wQ2P\/ywGIufey1Zvse2E37eaVGwpp1u3a5BbmfldB249Lj4+pSYgNJ\/8oU3abr2PHvq\/65pViM=',
  'real': '',
  'monthlyRealValues': [],
}, {
  'id': 435,
  'budgetYear': { 'id': 7, 'budget': [] },
  'category': { 'id': 36, 'type': 'expense' },
  'month': 1,
  'plan': 'wy4ECQMIfXrWDbRjD5Fg3eiz86Ib6vMus\/5J53TPm4TWZ4\/79r898Z2Dgzqj3X\/60jkB\/DazCWGx4HAk2oudn0tBXg11rSq5Md4zeegGZxoek79artOssOFRqEmoQPGJUneYgrg3LEfNc2s=',
  'real': 'wy4ECQMI35Zc28H9rY1g7aq4W+S4y9MPMB4NIF4U+M02eno6mUJ9RtTZOTG4YppF0jwBT74L80qg1jG8FoWOW+lQmmfQ8qDjQi\/2pYb7ZXOoFlCPhVoJml8\/XVZYItYZva48HScsMcABF6hhyv0=',
  'monthlyRealValues': [],
}, {
  'id': 436,
  'budgetYear': { 'id': 7, 'budget': [] },
  'category': { 'id': 37, 'type': 'expense' },
  'month': 1,
  'plan': 'wy4ECQMI3Nha3LvyiwxgPZaFV4gWL+svbHS53nnCL9iYjdNGOEh5XD\/yn1ByOPFk0jkBOJ4wWlxG\/8JFBjw\/Kt95kiOyGoTeDXp3AeHVjlEUT4EYvfxtqgtouG0IxOI6EmOi29U76JQD8Ao=',
  'real': 'wy4ECQMIunqUIWV6hOhgPFpeBjsRk09k2IYJKgaxdiuFSxAl\/mJcOKdvFiJRCF+90j4BkwH9anN3DjkY492627LMVQ\/0466MaiHJVAnfDthw6OImdf5\/GbflCwZsSGeQqgfe+g\/MwsRue7d6yomMQQ==',
  'monthlyRealValues': [],
}, {
  'id': 437,
  'budgetYear': { 'id': 7, 'budget': [] },
  'category': { 'id': 38, 'type': 'expense' },
  'month': 1,
  'plan': 'wy4ECQMIht55CjZSMAJgpygd6\/u+9G3cFvmKpsyshyOjacQwes17p7n11\/Ai4G1A0jkB4zi60bcVgDoMiEyBJYQkUHYMdDoQDu+iY1+IKfYVEyedXzXv4j2cFHaBsV1Jlv+VLxQcVxoz+UI=',
  'real': 'wy4ECQMIoigUPjtRQJlgBfShly\/k9HlqvGBNewFSRpIYeoiuUzztmyKcG8hR3AFP0j4B2VXNFXbLh9NaNMm6seQITFTCSzH1Wg3AVDZCrfJeht5VZu3\/\/9GI\/27wOaHh+1ZY8jykKs6Z351So08GOA==',
  'monthlyRealValues': [],
}, {
  'id': 439,
  'category': { 'id': 59, 'type': 'irregular' },
  'month': 1,
  'plan': 'wy4ECQMIYYAGc7TBVKBg1hYRfXsZIdzV\/qJL66S6tXLhbQGwvVZC6rcrDMBsPC+90jsBU8XPmVGegNFhzVE0EwkcWXzjLvv4EcA8uyAYoVYZ+y+NqNtz4fZIiA3nFCB2BJN\/U1ejTRLCId\/1oQ==',
  'real': 'wy4ECQMIvidnu8Nz0slgvcdHD3id1RNT6C4rX\/7ISJW2XgsNMOfQFQ1ByezPELbX0koBdyjrn36w\/ekNyIuDSzxfXFofWAFYE7PM+epKFBmI6+75oOAYrO99waIaCZAYGoMWyk4heodPtB8VOwP\/Mr+ZwX3S48gssBxK6Q==',
  'monthlyRealValues': [],
}, {
  'id': 452,
  'budgetYear': { 'id': 7, 'budget': [] },
  'category': { 'id': 60, 'type': 'irregular' },
  'month': 1,
  'plan': 'wy4ECQMI+r7Wc8wrdddgLKGq5o9LOKXGlohhRAw\/DKlXbqOZlcsQfF45BUaOSm3F0jsB6OhXrnnx4uXGme1KUE3nnV4J8fEW0tGn4KgrpZkPgtSXOdtkpAWMt0E2CjpKOdKyPt5L5G6\/9xVSrA==',
  'real': 'wy4ECQMIXbRBL4Z\/uvlg+43769LGO4oJ23j4kgijTgc\/Xmdqv3QY4JQe50QR6lIv0j4BfjBz718a9nlcDk1X1Opa4y8gPRqtqw7xNTb0k2wwNqtfeXSb480ooICXy1TPHd1Q\/NzyxCEj+mUGDI0ECA==',
  'monthlyRealValues': [],
}, {
  'id': 465,
  'budgetYear': { 'id': 7, 'budget': [] },
  'category': { 'id': 61, 'type': 'irregular' },
  'month': 1,
  'plan': 'wy4ECQMIA6NvyXe\/mdBgJwi541ZLLRejVdSFjfmvXJDa2hS5m9PYtcpJbULHEpPO0jsB77lbHwGIBEZyCS1t9ymie\/11kBq5FRFmeMvBuC5W7M6jjMr6U+DhxUdiO7OSlN0lM5Ux8AJ7WZrHAQ==',
  'real': '',
  'monthlyRealValues': [],
}, {
  'id': 478,
  'budgetYear': { 'id': 7, 'budget': [] },
  'category': { 'id': 62, 'type': 'irregular' },
  'month': 1,
  'plan': 'wy4ECQMI9vw2pr9yx8Jg8+JizoT+fWmOREE4dRIrgWKiYnTO23boX\/mrQYmCq6n30jsBohPswK3xuzjGqOKGSkupGCHFlM2UxyyS4QTO4W\/3UwspTfjXH+FoWrPyMGLS6jUJHONr7KZ8GqyubA==',
  'real': 'wy4ECQMIw6Gn6zaCDZVgeQHeJmnTUBGzNSEh5FEDMLR2+uqPRP\/7ZLyxO5YfYaLd0kkBwjSY1hq11or4ljSc5HXsjRJOhHViPi2L2KCO15j9gNfZzKFde07ziAM76C58IeoU6Oi9ONfNxBg5yZB7D11uzEPe8sP0EWS9',
  'monthlyRealValues': [],
}, {
  'id': 491,
  'budgetYear': { 'id': 7, 'budget': [] },
  'category': { 'id': 63, 'type': 'irregular' },
  'month': 1,
  'plan': 'wy4ECQMIgWo4u5ID7VZgsPpdQ5JdBNSg\/SAhERYAnHG+C8zOz0vvnldRLqDuFG6t0j0Bcik8g0Y6+ETmb1zB7vk2IL2bg9cQXOafMcTurDTavgdRbUx0AVEwNDVu\/1KZFvIncVx52gdjEV3iivrA',
  'real': 'wy4ECQMIvZzvOyy313hg9dmdlfeecfdodPblHHFUkMzdevMU9REaiptQkQzJuQLP0koBZnuwd8KI4jSatUb5Kx2ctt7Fqq+mcyt3qF4l9Sju7GVxIAnBIqQZQhkPGoyDY6f1r7\/myIE+uULX\/zi2nPhqYpc1+VxdUIAe3g==',
  'monthlyRealValues': [],
}, {
  'id': 504,
  'budgetYear': { 'id': 7, 'budget': [] },
  'category': { 'id': 64, 'type': 'irregular' },
  'month': 1,
  'plan': 'wy4ECQMIKbL+N6UtW+pgS9ML0IRs0Z6X9GVRUUqB9IXTQeZtOC9MHuEGKvPAhp8K0jsBUVuL5CWAFWZhVdwADd2xNB5+8B+HkXAPY8\/S7DoHuHhjFPVe08kcQDqxSHYGO5YGWjbq1UWBCwIY4g==',
  'real': 'wy4ECQMIZn1oGL2kZLtgSHUI9UNsVPGw+zQYvDD3XIgCCxOJO2i2qr3Dx6KqzQ6u0jwBQnMCVqIYV4B6WzbKmbQosKsBqzWZg3VoxXnWptMZcoi++RZh8F05EYz7btzUXu4RQ+gLAnuGZns10YA=',
  'monthlyRealValues': [],
}, {
  'id': 517,
  'budgetYear': { 'id': 7, 'budget': [] },
  'category': { 'id': 65, 'type': 'irregular' },
  'month': 1,
  'plan': 'wy4ECQMItQnkotuhGZlg\/Qak+Pvd8XN02Zp5xbaIK9a0yq\/UU1o\/z+3fKUhJazC70jsBSKPMsx4lofFt20Oe6W9KJQ6ybfmovRsLGf95a5HinSwmApf1PFEyTIJloMZwINmHGbjtvX+7DQgNxQ==',
  'real': 'wy4ECQMIg1GhNkm\/A0ZgYrjj+ooJFrEI8KU0qJs2aIrKrxeV4UgXHEhcPwahhPoc0j8BG7PVrsXiIDyB1YwPQeNXvxBf8vfOm2GNRmEJ8Y3Qe6YjR65VWl1lZSk9Dl4MYWNcKJqoWNnPcmYX2C+oRNk=',
  'monthlyRealValues': [],
}, {
  'id': 530,
  'budgetYear': { 'id': 7, 'budget': [] },
  'category': { 'id': 66, 'type': 'irregular' },
  'month': 1,
  'plan': 'wy4ECQMISETgVV\/bGVRgN6byZ4wvgCOCTarXBEqHZWXDBu3bsy2sofcm6+FmNi1a0joB+k0UEmCx6mxHnPvK+yeCZ2yQJsrVsV2ZwPj2wVMl1kRdwc0y54t3GssTMf0Y80MJb2hXPwBev3m8',
  'real': 'wy4ECQMISh8e5ky0MP9gFb9tN\/gkqrT21ZQ4K1S+rK61pxWHXlsvT4OK5Gc\/nPIf0j0BQ2mt\/OCJ1W1djSNyqW7tbryTbAatILZHIV3\/\/yb\/J3bF3qyWlyE4wsvd3UcluPV24YYOVKXP09gQ2do3',
  'monthlyRealValues': [],
}, {
  'id': 543,
  'budgetYear': { 'id': 7, 'budget': [] },
  'category': { 'id': 67, 'type': 'irregular' },
  'month': 1,
  'plan': 'wy4ECQMIjS4oNG1h1qhgCCfKdPAbsSc6yOKp+oN28g\/KKhVMAHBZ+8efuZBabDpl0joBA9IMZs8oClNjwPRrZXJGOXpGMhLB7l0QE588isRZ6h5ZpeiAtSF2A7b3ElnBLO7IGzntgcl3sdbb',
  'real': '',
  'monthlyRealValues': [],
}, {
  'id': 556,
  'budgetYear': { 'id': 7, 'budget': [] },
  'category': { 'id': 68, 'type': 'irregular' },
  'month': 1,
  'plan': 'wy4ECQMIgRcttI9sTNlgVbuZcRoIt2+sDu9T9BSNL20ytFTx8ydOyNg1XG6HxOSY0jkB4SOZK9v0trHPcOxx0\/qIypxFQNrHIheYTJlZKaqLZdYKHkRmNn+8AhhrJL64Er+d+BtZSSXl5+8=',
  'real': '',
  'monthlyRealValues': [],
}, {
  'id': 569,
  'budgetYear': { 'id': 7, 'budget': [] },
  'category': { 'id': 69, 'type': 'irregular' },
  'month': 1,
  'plan': 'wy4ECQMIec2chCZybvRgp\/ioX56xUCX\/EH8OBunNR9fz0\/zrlKzXl1pvjdbPKMBt0joBCZJnDr91KCrp5UQJMsrSPmJz8dIB16RPAuu4oH2B74rTrUWOntpTgOtqDEvGAHEI5WPKxaOTbiDH',
  'real': 'wy4ECQMIyKw7Nt5is7Ngvh7pSnkqJZ\/QSOfFwKWIVnD4WztTBp3qSxnQ9VQ\/gMAJ0kkBYSTNVtTIZ+nqNlyMBT6HE1Ol4303nV5u664JuJX\/GrkuwnseM7utaG3\/F0d5elQtvIwOhauOgRzMiYsMPhvtUqPsfTJROKdI',
  'monthlyRealValues': [],
}, {
  'id': 581,
  'budgetYear': { 'id': 7, 'budget': [] },
  'category': { 'id': 5, 'type': 'income' },
  'month': 1,
  'plan': '',
  'real': 'wy4ECQMI666bMNnJSNtg5FcpNKgd6na0vIyI34\/QsnGkgwpJKFzz4wt7G+Ra8wGU0jkBl649Hdq9ZcEYH+nIYahAL+26Zn8\/PoiMDTHtHvWrDLlrIlvZYhqzl\/Y\/96B1pRcxAOky6kqS1XY=',
  'monthlyRealValues': [],
}, {
  'id': 583,
  'budgetYear': { 'id': 7, 'budget': [] },
  'category': { 'id': 71, 'type': 'irregular' },
  'month': 1,
  'plan': 'wy4ECQMIuoUUUk179JNgIeBdTzwFUCPg1xjveYTa+cUcPgLKEsvGVz3vdIyWqKUF0jsBYIK33xdAnx4NDKfcuUAutdSkcquycDXSa2+bgk56MAZGFfABKx0MLoxfhAHhZ0eZyXsRNrZV2EQdwQ==',
  'real': 'wy4ECQMIkFA2+PYdV1BglKrqyzKvTMDEXYzuCU2CGjd5yeAcFyO1LNuGQi0JWN2O0jwBh\/tRnEHYyxOoXDaKEXewdrkUpuOU2p+qJzxJUw+2pJoKbZK9DhwIXXKa6VqLUT\/03JW2RhNXDuitwCE=',
  'monthlyRealValues': [],
}, {
  'id': 598,
  'budgetYear': { 'id': 7, 'budget': [] },
  'category': { 'id': 70, 'type': 'expense' },
  'month': 1,
  'plan': '',
  'real': 'wy4ECQMIJbiD1oh29TZgWZsoyvzSz+COALA3+Rw8tePB\/QXa4omtcFOYVphm9QGL0joBFj6LUpegb7\/Z\/+bs2fTWDYQ0BTbvIJvJwMDg74jaVQSBHzZ4oBDT5GB29y8iN86XFKsbrKgb9JHG',
  'monthlyRealValues': [],
}, {
  'id': 599,
  'budgetYear': { 'id': 7, 'budget': [] },
  'category': { 'id': 22, 'type': 'expense' },
  'month': 1,
  'plan': '',
  'real': 'wy4ECQMIAGI4o1+698tg2wxf1Yom9gYHH7lysvXAhMHxPEaZP0ge89puZbY2UhTV0joB2ompa8RJbyzzTkoqcbf\/2CGtYpofBWe\/oLJV6gFf3sv1pT9\/q38SYDSFoHeuNDiULxjZ9dFzVnqv',
  'monthlyRealValues': [],
}] as BudgetEntry[]

export class BudgetEntryService {
  static loadFromCache = async (request: Request): Promise<AppAction> => {
    const cached = await caches.match(request)

    if (cached) {
      const response = cached.clone()
      const entries = await response.json() as BudgetEntry[]

      return updateEntries({
        entries,
        source: 'cache',
      })
    }

    return noop()
  }

  static fetchFromNetwork = async (request: Request): Promise<AppAction> => {
    try {
      const response = await fetch(request)
      const cache = await caches.open('SimplyBudget')
      await cache.put(request, response.clone())

      const entries = await response.json() as BudgetEntry[]

      return updateEntries({
        entries,
        source: 'network',
      })
    } catch (err) {
      // TODO: Restore error catching
      return new Promise<AppAction>(resolve => {
        setTimeout(() => resolve(updateEntries({
          entries: budgetEntries,
          source: 'network',
        })), 1000)
      })

      return pageError({
        text: 'Network connection failed',
        sticky: false,
        type: AppMessageType.ERROR,
      })
    }
  }
}
