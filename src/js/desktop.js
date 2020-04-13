jQuery.noConflict();

(($, PLUGIN_ID) => {
  'use strict';

  const PLUGIN_CONFIG = kintone.plugin.app.getConfig(PLUGIN_ID);
  const POST_URL = `https://${window.location.hostname}/k/v1/space/thread/comment.json`;

  // レコード再利用時に、投稿済フラグを初期化
  kintone.events.on('app.record.create.show', (event) => {
    event.record[PLUGIN_CONFIG.checkboxCode].value = [];
    return event;
  });

  // レコード登録、編集時に投稿済フラグを編集不可にする
  kintone.events.on(['app.record.create.show', 'app.record.edit.show'], (event) => {
    event.record[PLUGIN_CONFIG.checkboxCode].disabled = true;
    return event;
  });

  kintone.events.on('app.record.create.submit', (event) => {
    return new kintone.Promise((resolve, reject) => {
      const record = event.record;

      // 未対応のフィールド：RICH_TEXT,CHECK_BOX,MULTI_SELECT,FILE,USER_SELECT,SUBTABLE,ORGANIZATION_SELECT,GROUP_SELECT
      // フィールドの値を取得する関数
      const getFieldValue = (fieldType, fieldCode) => {
        if (fieldType === 'CREATOR' || fieldType === 'MODIFIER') {
          return record[fieldCode].value.name;
        } else if (fieldType === 'DATETIME' || fieldType === 'CREATED_TIME' || fieldType === 'UPDATED_TIME') {
          return record[fieldCode].value.replace('T', ' ').replace('Z', '');
        }
        return record[fieldCode].value;
      };

      // スレッドに投稿するコメントを整形する関数
      const formatPostComment = (fields) => {
        const postFields = fields.filter(field => field.label.length > 0);
        const postCommentArr = [];
        postFields.forEach(field => {
          postCommentArr.push(`${field.label}：${getFieldValue(field.type, field.code)}`);
        });
        return postCommentArr.join('\n');
      };

      const FIELDS = [
        {
          label: PLUGIN_CONFIG.field_1_label,
          code: PLUGIN_CONFIG.field_1_code,
          type: PLUGIN_CONFIG.field_1_type
        },
        {
          label: PLUGIN_CONFIG.field_2_label,
          code: PLUGIN_CONFIG.field_2_code,
          type: PLUGIN_CONFIG.field_2_type
        },
        {
          label: PLUGIN_CONFIG.field_3_label,
          code: PLUGIN_CONFIG.field_3_code,
          type: PLUGIN_CONFIG.field_3_type
        },
        {
          label: PLUGIN_CONFIG.field_4_label,
          code: PLUGIN_CONFIG.field_4_code,
          type: PLUGIN_CONFIG.field_4_type
        },
        {
          label: PLUGIN_CONFIG.field_5_label,
          code: PLUGIN_CONFIG.field_5_code,
          type: PLUGIN_CONFIG.field_5_type
        }
      ];

      const POST_COMMENT = formatPostComment(FIELDS);
      const AUTH_STRING = btoa(`${PLUGIN_CONFIG.userid}:${PLUGIN_CONFIG.password}`);
      const SPACE_ID = PLUGIN_CONFIG.space;
      const THREAD_ID = PLUGIN_CONFIG.thread;
      const MENTION_CODE = PLUGIN_CONFIG.mentionCode;
      const MENTION_TYPE = PLUGIN_CONFIG.mentionType;
      const BODY = {
        space: SPACE_ID,
        thread: THREAD_ID,
        comment: {
          text: POST_COMMENT,
          mentions: [{
            code: MENTION_CODE,
            type: MENTION_TYPE
          }]
        },
        __REQUEST_TOKEN__: kintone.getRequestToken()
      };

      // kintone.apiでは認証ユーザーの指定ができないため、
      // プラグインに持たせた認証情報でPOSTするために fetch API を利用する
      fetch(POST_URL, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Cybozu-Authorization': AUTH_STRING
        },
        body: JSON.stringify(BODY),
      })
        .then(() => {
          // alert('本レコードの内容がスレッドに投稿されました。');
          record[PLUGIN_CONFIG.checkboxCode].value[0] = PLUGIN_CONFIG.checkboxOption;
          resolve(event);
        })
        .catch((resp) => {
          // TODO: 失敗した際に、アラートを出す
          event.error = resp.message;
          reject(event);
        });
    });
  });
})(jQuery, kintone.$PLUGIN_ID);
