jQuery.noConflict();

(function($, PLUGIN_ID) {
  'use strict';

  const fieldElements = {
    $form: $('.js-submit-settings'),
    $cancelButton: $('.js-cancel-button'),
    $userid: $('.js-text-userid'),
    $password: $('.js-text-password'),
    $space: $('.js-text-space'),
    $thread: $('.js-text-thread'),
    $mentionCode: $('.js-text-mention-code'),
    $mentionType: document.getElementsByName('radio'),
    $fields: $('.js-dropdown-field'),
    $checkboxCode: $('.js-text-checkbox-code'),
    $checkboxOption: $('.js-text-checkbox-option')
  };

  const config = kintone.plugin.app.getConfig(PLUGIN_ID);

  // ラジオボタンのデータを取得
  function getMentionType() {
    let mentionType = '';
    const radioButton = document.getElementsByName('radio');

    radioButton.forEach(el => {
      if (el.checked === true) {
        mentionType = el.value;
      }
    });
    return mentionType;
  }

  // スレッドに投稿するフィールドを選択するドロップダウンを生成
  // eslint-disable-next-line no-undef
  KintoneConfigHelper.getFields()
    .then((resp) => {
      // ドロップダウンの一行目に未選択の選択肢を設置
      let $option = $('<option></option>');
      $option.attr('value', '');
      $option.text('---');
      fieldElements.$fields.append($option);

      resp.forEach(field => {
        $option = $('<option></option>');
        $option.attr('value', `${field.code}&${field.type}&${field.label}`);
        $option.text(field.label);
        fieldElements.$fields.append($option);
      });
    })
    .catch((err) => {
      alert('フォームを取得できませんでした。\nリロードしてください。')
    });

  // 既に保持している設定情報を反映
  if (config.userid) {
    fieldElements.$userid.val(config.userid);
  }
  if (config.password) {
    fieldElements.$password.val(config.password);
  }
  if (config.space) {
    fieldElements.$space.val(config.space);
  }
  if (config.thread) {
    fieldElements.$thread.val(config.thread);
  }
  if (config.mentionCode) {
    fieldElements.$mentionCode.val(config.mentionCode);
  }
  if (config.mentionType) {
    fieldElements.$mentionType.forEach(button => {
      if (button.value === config.mentionType) button.checked = true;
    });
  }
  // TODO: for文で書き直す
  // TODO: 再度開いた際にドロップダウンの初期値が入らない問題を解決する
  if (config.field_1_code) {
    fieldElements.$fields[0].value = `${config.field_1_code}&${config.field_1_type}&${config.field_1_label}`;
  }
  if (config.field_2_code) {
    fieldElements.$fields[1].value = `${config.field_2_code}&${config.field_2_type}&${config.field_2_label}`;
  }
  if (config.field_3_code) {
    fieldElements.$fields[2].value = `${config.field_3_code}&${config.field_3_type}&${config.field_3_label}`;
  }
  if (config.field_4_code) {
    fieldElements.$fields[3].value = `${config.field_4_code}&${config.field_4_type}&${config.field_4_label}`;
  }
  if (config.field_5_code) {
    fieldElements.$fields[4].value = `${config.field_5_code}&${config.field_5_type}&${config.field_5_label}`;
  }
  if (config.checkboxCode) {
    fieldElements.$checkboxCode.val(config.checkboxCode);
  }
  if (config.checkboxOption) {
    fieldElements.$checkboxOption.val(config.checkboxOption);
  }

  fieldElements.$form.on('submit', (e) => {
    e.preventDefault();

    const configSettings = {
      userid: fieldElements.$userid.val(),
      password: fieldElements.$password.val(),
      space: fieldElements.$space.val(),
      thread: fieldElements.$thread.val(),
      mentionCode: fieldElements.$mentionCode.val() || '',
      mentionType: getMentionType(),
      field_1_code: fieldElements.$fields[0].value.split('&')[0] || '',
      field_1_type: fieldElements.$fields[0].value.split('&')[1] || '',
      field_1_label: fieldElements.$fields[0].value.split('&')[2] || '',
      field_2_code: fieldElements.$fields[1].value.split('&')[0] || '',
      field_2_type: fieldElements.$fields[1].value.split('&')[1] || '',
      field_2_label: fieldElements.$fields[1].value.split('&')[2] || '',
      field_3_code: fieldElements.$fields[2].value.split('&')[0] || '',
      field_3_type: fieldElements.$fields[2].value.split('&')[1] || '',
      field_3_label: fieldElements.$fields[2].value.split('&')[2] || '',
      field_4_code: fieldElements.$fields[3].value.split('&')[0] || '',
      field_4_type: fieldElements.$fields[3].value.split('&')[1] || '',
      field_4_label: fieldElements.$fields[3].value.split('&')[2] || '',
      field_5_code: fieldElements.$fields[4].value.split('&')[0] || '',
      field_5_type: fieldElements.$fields[4].value.split('&')[1] || '',
      field_5_label: fieldElements.$fields[4].value.split('&')[2] || '',
      checkboxCode: fieldElements.$checkboxCode.val(),
      checkboxOption: fieldElements.$checkboxOption.val()
    };

    // TODO: ボタン押下時にuseridとpasswordが正しいか確認する仕組みを入れる
    kintone.plugin.app.setConfig(configSettings, () => {
      alert('The plug-in settings have been saved. Please update the app!');
      window.location.href = '../../flow?app=' + kintone.app.getId();
    });
  });
  fieldElements.$cancelButton.on('click', () => {
    window.location.href = '../../' + kintone.app.getId() + '/plugin/';
  });
})(jQuery, kintone.$PLUGIN_ID);
