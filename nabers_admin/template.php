<?php

/**
 * @file
 * Contains the theme's functions to manipulate Drupal's admin default markup.
 */

/**
 * Implements hook_media_wysiwyg_token_to_markup_alter().
 *
 * @see media_wysiwyg_token_to_markup()
 */
function nabers_admin_media_wysiwyg_token_to_markup_alter(&$element, $tag_info, $settings) {
  unset($element['content']['#type']);
  unset($element['content']['#attributes']);
  $element['content']['#file']->media_markup = TRUE;
}

/**
 * Implements theme_file_icon().
 */
function nabers_admin_file_icon($variables) {
  $file = $variables['file'];
  $alt = $variables['alt'];
  $icon_directory = drupal_get_path('theme', 'govcms_ui_kit') . '/dist/images/png/icons';

  $mime = check_plain($file->filemime);
  if ($mime == 'application/rtf') {
    $file->filemime = 'application/msword';
  }

  if ($mime == 'text/csv') {
    $file->filemime = 'text/csv';
  }

  $icon_url = file_icon_url($file, $icon_directory);

  return '<span class="file-icon-wrapper"><img class="file-icon" alt="' . check_plain($alt) . '" title="' . $mime . '" src="' . $icon_url . '" /></span>';
}

/**
 * Implements hook_preprocess_file_entity().
 */
function nabers_admin_preprocess_file_entity(&$variables) {
  $variables['theme_hook_suggestions'][] = 'file_entity__inline_wysiwyg';
}

/**
 * Implements hook_form_alter().
 */
function nabers_admin_form_alter(&$form, &$form_state, $form_id) {
  switch ($form_id) {
    case 'training_node_form':
      $form['field_training_cost']['#states']['visible'] = [
        'select[name="field_training_cost_type[und]"]' => ['value' => 'paid'],
      ];
      $form['field_training_cost']['#states']['required'] = [
        'select[name="field_training_cost_type[und]"]' => ['value' => 'paid'],
      ];

      break;
  }
}
