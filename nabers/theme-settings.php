<?php

/**
 * @file
 * Theme settings for govCMS UI Kit theme.
 */

/**
 * Implements hook_system_theme_settings_alter().
 */
function govcms_ui_kit_form_system_theme_settings_alter(&$form, $form_state) {
  $form['govcms_ui_kit_options'] = [
    '#type' => 'fieldset',
    '#title' => t('govCMS UI Kit settings'),
    '#weight' => 5,
    '#collapsible' => FALSE,
    '#collapsed' => FALSE,
  ];

  $form['govcms_ui_kit_options']['govcms_ui_kit_header_title'] = [
    '#type'          => 'textfield',
    '#title'         => t('Header title'),
    '#default_value' => theme_get_setting('govcms_ui_kit_header_title'),
    '#description'   => t("Text to display beside the site logo in the top header."),
  ];

  $form['govcms_ui_kit_options']['govcms_ui_kit_header_logo_alt'] = [
    '#type'          => 'textfield',
    '#title'         => t('Header logo alternative text'),
    '#default_value' => theme_get_setting('govcms_ui_kit_header_logo_alt'),
    '#description'   => t("Alternative text to assign to the logo in the top header."),
  ];

  $form['govcms_ui_kit_options']['govcms_ui_kit_footer_copyright'] = [
    '#type'          => 'textfield',
    '#title'         => t('Footer copyright'),
    '#default_value' => theme_get_setting('govcms_ui_kit_footer_copyright'),
    '#description'   => t("Text to display beside the sub menu links. Defaults to <em>&copy; [current year]. [Site Name]. All rights reserved.</em>"),
  ];

  $form['govcms_ui_kit_options']['govcms_ui_kit_override_image_styles'] = [
    '#type'          => 'checkbox',
    '#title'         => t('Override image styles'),
    '#default_value' => theme_get_setting('govcms_ui_kit_override_image_styles'),
    '#description'   => t("Enable this to override any user-defined image styles with govCMS UI Kit default styles. Disabling this is recommend if modifying site."),
  ];

  $form['govcms_ui_kit_options']['govcms_ui_kit_fix_site_width'] = [
    '#type'          => 'checkbox',
    '#title'         => t('Fix site width'),
    '#default_value' => theme_get_setting('govcms_ui_kit_fix_site_width'),
    '#description'   => t("Enable this to fix the width of the site contents and footer to a max of 1650 pixels."),
  ];

  $form['govcms_ui_kit_options']['govcms_ui_kit_show_webform_assistance'] = [
    '#type'          => 'checkbox',
    '#title'         => t('Show webform assistance'),
    '#default_value' => theme_get_setting('govcms_ui_kit_show_webform_assistance'),
    '#description'   => t('Display "Fields marked * are required." message on all webforms.'),
  ];

  $form['govcms_ui_kit_options']['govcms_ui_kit_google_map_api_key'] = [
    '#type'          => 'textfield',
    '#title'         => t('Google Map API key'),
    '#default_value' => theme_get_setting('govcms_ui_kit_google_map_api_key'),
    '#description'   => t("Add Google Map API key. <a href='https://developers.google.com/maps/documentation/javascript/get-api-key' target='_blank'>Get API Key</a>"),
  ];

  $form['govcms_ui_kit_options']['govcms_ui_kit_google_tags_manager_container_id'] = [
    '#type'          => 'textfield',
    '#title'         => t('Google Tags Manager Container ID'),
    '#default_value' => theme_get_setting('govcms_ui_kit_google_tags_manager_container_id'),
    '#description'   => t("Add Google Tags Manager Container ID for this environment, it looks like GTM-....."),
  ];

  $form['rating_calculator_api_settings'] = [
    '#type' => 'fieldset',
    '#title' => t('Rating Calculators - API settings'),
    '#weight' => 6,
    '#collapsible' => FALSE,
    '#collapsed' => FALSE,
  ];

  $form['rating_calculator_api_settings']['govcms_ui_kit_rating_calculator_api_url'] = [
    '#type'          => 'textfield',
    '#title'         => t('API URL'),
    '#default_value' => theme_get_setting('govcms_ui_kit_rating_calculator_api_url'),
    '#description'   => t("The URL that returns the rating calculator results."),
  ];

  $form['rating_calculator_api_settings']['govcms_ui_kit_rating_calculator_authentication_url'] = [
    '#type'          => 'textfield',
    '#title'         => t('Authentication URL'),
    '#default_value' => theme_get_setting('govcms_ui_kit_rating_calculator_authentication_url'),
    '#description'   => t("The URL that returns the access token required to access the API."),
  ];

  $form['rating_calculator_api_settings']['govcms_ui_kit_rating_calculator_client_id'] = [
    '#type'          => 'textfield',
    '#title'         => t('Client ID'),
    '#default_value' => theme_get_setting('govcms_ui_kit_rating_calculator_client_id'),
    '#description'   => t("The client id required to access the API."),
  ];

  $form['rating_calculator_api_settings']['govcms_ui_kit_rating_calculator_client_secret'] = [
    '#type'          => 'textfield',
    '#title'         => t('Client Secret'),
    '#default_value' => theme_get_setting('govcms_ui_kit_rating_calculator_client_secret'),
    '#description'   => t("The client secret required to access the API."),
  ];

  $form['rating_register_settings'] = [
    '#type' => 'fieldset',
    '#title' => t('Rating Register settings'),
    '#weight' => 7,
    '#collapsible' => FALSE,
    '#collapsed' => FALSE,
  ];

  $form['rating_register_settings']['govcms_ui_kit_rating_register_data_source'] = [
    '#type'          => 'textarea',
    '#title'         => t('JSON data source'),
    '#default_value' => theme_get_setting('govcms_ui_kit_rating_register_data_source'),
    '#description' => t("<p><strong>This will override the json file uploaded in the rating register content page.</strong></p><p>The url for the rating register data source.</p><p>JSONP method is used therefore the file must be a javascript file that returns JSON data inside a function call. Read more about <a href='https://www.w3schools.com/js/js_json_jsonp.asp' target='_blank'>JSONP</a>.</p>"),
  ];

  $form['rating_register_settings']['govcms_ui_kit_rating_register_csv_source'] = [
    '#type'          => 'textarea',
    '#title'         => t('CSV source'),
    '#default_value' => theme_get_setting('govcms_ui_kit_rating_register_csv_source'),
    '#description'   => t("<p><strong>This will override the CSV file uploaded in the rating register content page.</strong></p><p>The url for all rating register data in CSV format.</p>"),
  ];
}
