# kintone-post-app2thread

Kintone plugin which post a record data to thread in space when you submit the record.

## Requirement

- Node.js v8 or later

## How to use

```
$ git clone https://github.com/zennosuke/kintone-post-app2thread.git
$ cd kintone-post-app2thread
$ npm install
$ npm install -g @kintone/plugin-packer
$ mkdir dist
$ kintone-plugin-packer src --out dist/plugin.zip
$ npm run upload
```

[kintone-plugin-packer](https://developer.cybozu.io/hc/ja/articles/360000910783)

[kintoneプラグイン開発手順](https://developer.cybozu.io/hc/ja/articles/203455680)

## Licence

[MIT](https://github.com/tcnksm/tool/blob/master/LICENCE)
