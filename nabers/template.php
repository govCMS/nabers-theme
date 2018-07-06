<?php

/**
 * @file
 * template.php
 */

// Content types with header image.
const CONTENT_WITH_IMAGE = ['page', 'news_article'];
const CONTENT_WITH_DATE = ['news_article', 'publication'];

/**
 * Implements hook_theme().
 */
function govcms_ui_kit_theme() {
  return [
    'landing_pages_tiles' => [
      'template' => 'templates/landing_pages_tiles',
      'variables' => ['items' => []],
    ],
  ];
}

/**
 * Implements hook_html_head_alter().
 */
function govcms_ui_kit_html_head_alter(&$head_elements) {
  // Mobile Viewport.
  $head_elements['viewport'] = [
    '#type' => 'html_tag',
    '#tag' => 'meta',
    '#attributes' => [
      'name' => 'viewport',
      'content' => 'width=device-width, initial-scale=1',
    ],
  ];
  // IE Latest Browser.
  $head_elements['ie_view'] = [
    '#type' => 'html_tag',
    '#tag' => 'meta',
    '#attributes' => [
      'http-equiv' => 'x-ua-compatible',
      'content' => 'ie=edge',
    ],
  ];
  // Add grddl_profile.
  $head_elements['profile'] = [
    '#type' => 'html_tag',
    '#tag' => 'link',
    '#attributes' => [
      'rel' => 'profile',
      'href' => 'http://www.w3.org/1999/xhtml/vocab',
    ],
  ];

  // Add favicons and apple-touch icon.
  $favicons = [
    ['rel' => 'apple-touch-icon', 'file' => 'apple-icon.png'],
    ['rel' => 'icon', 'file' => 'favicon-32x32.png'],
    ['rel' => 'icon', 'file' => 'favicon-16x16.png'],
  ];

  foreach ($favicons as $favicon) {
    $favicon_path = drupal_get_path('theme', 'govcms_ui_kit') . '/dist/images/png/favicons/' . $favicon['file'];
    if (!empty($favicon_path)) {
      $favicon_url = file_create_url($favicon_path);
      $element = [
        '#type' => 'html_tag',
        '#tag' => 'link',
        '#attributes' => [
          'rel' => $favicon['rel'],
          'href' => $favicon_url,
        ],
      ];
      $head_elements[] = $element;
    }
  }
}

/**
 * Implements hook_js_alter().
 */
function govcms_ui_kit_js_alter(&$javascript) {
  $javascript['misc/jquery.js']['data'] = drupal_get_path('theme', 'govcms_ui_kit') . '/vendor/jquery/jquery-3.1.1.min.js';
}

/**
 * Implements hook_preprocess_html().
 */
function govcms_ui_kit_preprocess_html(&$variables) {
  drupal_add_js("(function(h) {h.className = h.className.replace('no-js', '') })(document.documentElement);", [
    'type' => 'inline',
    'scope' => 'header',
  ]);
  drupal_add_js('jQuery.extend(Drupal.settings, { "pathToTheme": "' . path_to_theme() . '" });', 'inline');
  // Drupal forms.js does not support new jQuery. Migrate library needed.
  drupal_add_js(drupal_get_path('theme', 'govcms_ui_kit') . '/vendor/jquery/jquery-migrate-1.2.1.min.js', ['weight' => -1]);
  drupal_add_js(drupal_get_path('theme', 'govcms_ui_kit') . '/vendor/jquery/jquery.polyfills.js', [
    'group' => 'JS_LIBRARY',
    'weight' => -1,
  ]);

  $govcms_ui_kit_gtm = theme_get_setting('govcms_ui_kit_google_tags_manager_container_id');

  if (empty($govcms_ui_kit_gtm) && user_is_logged_in()) {
    drupal_set_message(t('Google Tags Manager has no Container ID configured. Navigate to <a href="/admin/appearance/settings/govcms_ui_kit">the configuration page</a> to update it.'), 'warning');
  }

  drupal_add_js("<!-- Google Tag Manager -->
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','" . $govcms_ui_kit_gtm . "');
    <!-- End Google Tag Manager -->", [
      'weight' => -900,
      'every_page' => TRUE,
      'scope' => 'header',
      'preprocess' => FALSE,
      'type' => 'inline',
    ]
  );

  drupal_add_css('//cloud.typography.com/7129036/6565592/css/fonts.css', ['type' => 'external']);

  if (theme_get_setting('govcms_ui_kit_fix_site_width') == 1) {
    $variables['classes_array'][] = 'fixed-width';
  }
}

/**
 * Implements hook_preprocess_field().
 */
function govcms_ui_kit_preprocess_field(&$variables) {
  $field_name = $variables['element']['#field_name'];
  $bundle = $variables['element']['#bundle'];
  // Bean 'Image and Text' field 'Link To' to show 'Read [title]' text.
  if ($field_name === 'field_link_to' && $bundle === 'image_and_text') {
    if (!empty($variables['items'][0]) && !empty($variables['element']['#object']->title)) {
      // This only applies if field has a non-configurable title.
      if ($variables['items'][0]['#field']['settings']['title'] === 'none') {
        $variables['items'][0]['#element']['title'] = t('Read !title', ['!title' => $variables['element']['#object']->title]);
      }
    }
  }
  if ($field_name === 'field_training_cost_type') {
    $cost_type = $variables['element']['#items'][0]['value'];
    if ($cost_type === 'paid') {
      $variables['classes_array'][] = $cost_type;
    }
  }
  if (theme_get_setting('govcms_ui_kit_override_image_styles') == 1) {
    // Define custom image style for image banners on home page.
    if ($field_name === 'field_slide_image') {
      if ($variables['items'][0]['#image_style'] === 'feature_article') {
        $variables['items'][0]['#image_style'] = 'govcms_ui_kit_banner';
      }
    }
    // Define custom image style for thumbnails on news / blogs / etc.
    elseif ($field_name === 'field_thumbnail') {
      $image_style = $variables['items'][0]['#image_style'];
      if ($image_style === 'medium' || $image_style === 'thumbnail') {
        $variables['items'][0]['#image_style'] = 'govcms_ui_kit_thumbnail';
      }
    }
    // Define custom image style for views.
    elseif ($field_name === 'field_image') {
      if ($variables['items'][0]['#image_style'] === 'medium') {
        $variables['items'][0]['#image_style'] = 'govcms_ui_kit_thumbnail';
      }
    }
  }
  $content_with_custom_field_template = ['assessor', 'commitment_agreement'];
  if (in_array($bundle, $content_with_custom_field_template)) {
    $variables['empty_placeholder'] = '';
    $variables['theme_hook_suggestions'][] = 'field__' . 'assessor_and_ca_field';
    if (empty($variables['items'])) {
      $variables['classes_array'][] = 'field--empty';
      if ($bundle === 'commitment_agreement' && $field_name === 'field_ca_date_certified') {
        $variables['empty_placeholder'] = '-';
      }
    }
  }

  // Add a css class when a commitment agreement's status is achieved.
  if ($field_name === 'field_ca_status') {
    if (!empty($variables['element']['#items'][0]['taxonomy_term'])) {
      $status = $variables['element']['#items'][0]['taxonomy_term']->name;
      if (strtolower($status) === 'achieved') {
        $variables['classes_array'][] = 'status-achieved';
      }
    }
  }
  // Add a comma after the building name.
  if ($field_name === 'field_ca_building_name') {
    if (!empty($variables['items'][0]['#markup'])) {
      $new_markup = $variables['items'][0]['#markup'] . ',';
      $variables['items'][0]['#markup'] = $new_markup;
    }
  }
}

/**
 * Implements hook_views_pre_render().
 */
function govcms_ui_kit_views_pre_render(&$variables) {
  if (theme_get_setting('govcms_ui_kit_override_image_styles') == 1) {
    if ($variables->name === 'footer_teaser') {
      $len = count($variables->result);
      for ($i = 0; $i < $len; $i++) {
        if (!empty($variables->result[$i]->field_field_image)) {
          // Define custom image style for thumbnails on footer_teaser.
          if ($variables->result[$i]->field_field_image[0]['rendered']['#image_style'] == 'blog_teaser_thumbnail') {
            $variables->result[$i]->field_field_image[0]['rendered']['#image_style'] = 'govcms_ui_kit_thumbnail';
          }
        }
      }
    }
  }
}

/**
 * Implements hook_image_styles_alter().
 */
function govcms_ui_kit_image_styles_alter(&$styles) {
  if (theme_get_setting('govcms_ui_kit_override_image_styles') == 1) {
    $styles['govcms_ui_kit_thumbnail'] = [
      'label' => 'govCMS UI-KIT - Thumbnail',
      'name' => 'govcms_ui_kit_thumbnail',
      'storage' => IMAGE_STORAGE_NORMAL,
      'effects' => [
        [
          'label' => 'Scale and crop',
          'name' => 'image_scale_and_crop',
          'data' => [
            'width' => 370,
            'height' => 275,
            'upscale' => 1,
          ],
          'effect callback' => 'image_scale_and_crop_effect',
          'dimensions callback' => 'image_resize_dimensions',
          'form callback' => 'image_resize_form',
          'summary theme' => 'image_resize_summary',
          'module' => 'image',
          'weight' => 0,
        ],
      ],
    ];
  }
  return $styles;
}

/**
 * Implements hook_preprocess_node().
 */
function govcms_ui_kit_preprocess_node(&$variables) {
  $type = $variables['type'];
  $node = $variables['node'];
  $view_mode = $variables['view_mode'];
  if ($view_mode === 'teaser' || $view_mode === 'compact') {
    $variables['classes_array'][] = 'listing-component';
    // Apply thumbnail class to node teaser view if image exists.
    $image_fields = ['field_thumbnail', 'field_image', 'field_feature_image'];
    foreach ($image_fields as $field) {
      if (!empty($variables['content'][$field])) {
        $variables['classes_array'][] = 'has-thumbnail';
        $variables['image_field_name'] = $field;
      }
    }

    // Ensure the view mode has a theme hook suggestion.
    $hook_suggestions = [
      'node__view__' . $view_mode,
      'node__' . $type . '__view__' . $view_mode,
    ];
    foreach ($hook_suggestions as $hook_suggestion) {
      if (!in_array($hook_suggestion, $variables['theme_hook_suggestions'])) {
        $variables['theme_hook_suggestions'][] = $hook_suggestion;
      }
    }
  }

  // Hide field_image in content types that have a header image.
  if (in_array($type, CONTENT_WITH_IMAGE) && !empty($variables['page'])) {
    hide($variables['content']['field_image']);
  }
  // Hide field_landing_featured_reports since it printed in the page header.
  if ($type === 'data_landing_page' && !empty($variables['page'])) {
    hide($variables['content']['field_landing_featured_reports']);
  }
  // Hide field_date in content types that have a header image.
  if (in_array($type, CONTENT_WITH_DATE) && !empty($variables['page'])) {
    hide($variables['content']['field_date']);
  }

  if ($type === 'webform') {
    // Hide submitted date on webforms.
    $variables['display_submitted'] = FALSE;
  }

  if ($type == 'training') {
    $training = entity_metadata_wrapper('node', $node);

    if (isset($training->field_training_cost_type) && isset($training->field_training_cost)) {
      $cost_type = $training->field_training_cost_type->value();
      if ($cost_type == 'paid') {
        $cost = $training->field_training_cost->value();
        $variables['content']['field_training_cost_type'][0]['#markup'] = check_plain($cost);
      }
    }

    if (isset($training->field_training_cta)) {
      $cta = $training->field_training_cta->value();
      $cta_field = field_info_field('field_training_cta');
      $cta_values = list_allowed_values($cta_field);
      $variables['content']['field_training_cta_link'][0]['#element']['attributes']['class'] = $cta;
      $variables['content']['field_training_cta_link'][0]['#element']['title'] = $cta_values[$cta];
    }
  }

  if ($type == 'landing_page' && node_is_page($node)) {
    // Load children of the current landing page.
    $active_trail = menu_get_active_trail();
    if (!empty($active_trail)) {
      $current_menu = end($active_trail);
      $sub_menus = _nabers_theme_submenu_tree_all_data($current_menu);

      $included = ['page', 'landing_page', 'news_article', 'rating_register'];
      if (!empty($sub_menus)) {
        $items = [];
        foreach ($sub_menus as $sub_menu) {
          $href = explode('/', $sub_menu['link']['href']);
          if (!empty($href[0]) && $href[0] == 'node' && !empty($href[1])) {
            $node_item = node_load($href[1]);
            if ($node_item && in_array($node_item->type, $included)) {
              $items[] = node_view($node_item, 'compact');
            }
          }
        }
        $variables['content']['tiles'] = [
          '#theme' => 'landing_pages_tiles',
          '#weight' => 1000,
          '#items' => $items,
        ];
      }
    }
  }

  if ($type == 'assessor') {
    try {
      $assessor = entity_metadata_wrapper('node', $node);
      if (isset($assessor->field_assessor_email)) {
        $email_link = $assessor->field_assessor_email->value();
        $variables['content']['field_assessor_email'][0]['#markup'] = l($email_link, format_string('mailto:@email', ['@email' => $email_link]), ['absolute' => TRUE]);
      }
      $location = '';
      if (isset($assessor->field_assessor_suburb)) {
        $location .= $assessor->field_assessor_suburb->value() . ' ';
      }
      if (!empty($assessor->field_assessor_state->name)) {
        $location .= $assessor->field_assessor_state->name->value() . ' ';
      }
      if (isset($assessor->field_assessor_postcode)) {
        $location .= $assessor->field_assessor_postcode->value();
      }
      $variables['location'] = $location;
    }
    catch (Exception $exception) {
      watchdog_exception('govcms_ui_ki', $exception);
    }
  }

  if (node_is_page($node)) {
    $variables['classes_array'][] = 'node-full';
  }

  if ($type == 'rating_register') {
    try {
      $ratings_register = entity_metadata_wrapper('node', $node);

      $rating_register_data_source = theme_get_setting('govcms_ui_kit_rating_register_data_source');
      $rating_register_csv_source = theme_get_setting('govcms_ui_kit_rating_register_csv_source');

      if (!empty($rating_register_csv_source)) {
        if (!empty($variables['content']['field_ratings_csv_file'])) {
          $url = check_url($rating_register_csv_source);
          $variables['content']['field_ratings_csv_file'][0] = [
            '#markup' => l(t('Download all rating data (CSV)'), $url, ['external' => TRUE]),
          ];
        }
      }

      if (empty($rating_register_data_source) && isset($ratings_register->field_ratings_json_file)) {
        $json_file = $ratings_register->field_ratings_json_file->value();
        if (file_exists($json_file['uri'])) {
          $json_data = file_get_contents($json_file['uri']);
          // Pass json data to JS.
          drupal_add_js(['govcms_ui_kit' => ['ratings_data' => drupal_json_decode($json_data)]], ['type' => 'setting']);
        }
      }
      else {
        drupal_add_js(['govcms_ui_kit' => ['rating_data_source' => $rating_register_data_source]], ['type' => 'setting']);
      }

      $assets_folder = '/' . drupal_get_path('theme', 'govcms_ui_kit') . '/rating-register/dist/static';
      drupal_add_js(['govcms_ui_kit' => ['ratings_assets_folder' => $assets_folder]], ['type' => 'setting']);

      // Add Google Map API.
      drupal_add_js(drupal_get_path('theme', 'govcms_ui_kit') . '/rating-register/dist/static/markerclusterer.js', ['scope' => 'footer']);

      $google_map_api_key = !empty(theme_get_setting('govcms_ui_kit_google_map_api_key')) ? theme_get_setting('govcms_ui_kit_google_map_api_key') : '';
      drupal_add_js(format_string('https://maps.googleapis.com/maps/api/js?key=@api_key', ['@api_key' => $google_map_api_key]), [
        'type' => 'external',
        'scope' => 'footer',
      ]);

      // Add Rating Register JS files.
      drupal_add_js(drupal_get_path('theme', 'govcms_ui_kit') . '/rating-register/dist/static/js/manifest.js', ['scope' => 'footer']);
      drupal_add_js(drupal_get_path('theme', 'govcms_ui_kit') . '/rating-register/dist/static/js/vendor.js', ['scope' => 'footer']);
      drupal_add_js(drupal_get_path('theme', 'govcms_ui_kit') . '/rating-register/dist/static/js/app.js', ['scope' => 'footer']);
    }
    catch (Exception $exception) {
      watchdog_exception('govcms_ui_ki', $exception);
    }
  }
  if ($type === 'staff_member') {
    try {
      $staff = entity_metadata_wrapper('node', $node);
    }
    catch (Exception $exception) {
      watchdog_exception('govcms_ui_ki', $exception);
    }
    $staff_title = !empty($staff->field_staff_title->value()) ? $staff->field_staff_title->value() . '. ' : '';
    $staff_full_name = $staff->title->value();
    $variables['title'] = t('@title@full_name', [
      '@title' => $staff_title,
      '@full_name' => $staff_full_name,
    ]);
    $email_link = $staff->field_staff_email->value();
    $variables['content']['field_staff_email'][0]['#markup'] = l(t('<span>Email me</span>'), format_string('mailto:@email', ['@email' => $email_link]), ['absolute' => TRUE, 'html' => TRUE]);

    $staff_first_name = $staff->field_first_name->value();
    $contact_for = $staff->field_staff_contact_for->value();
    $variables['content']['field_staff_contact_for'][0]['#markup'] = t('Contact @first_name for @contact_for', [
      '@first_name' => $staff_first_name,
      '@contact_for' => $contact_for,
    ]);
  }
}

/**
 * Get the children of a menu item in a given menu.
 *
 * @param array $link
 *   The menu link.
 * @param string $menu
 *   The internal menu name.
 *
 * @return array
 *   The children of the given parent.
 */
function _nabers_theme_submenu_tree_all_data(array $link, $menu = 'main-menu') {
  $tree = menu_build_tree($menu, [
    'min_depth' => $link['depth'] + 1,
    'max_depth' => $link['depth'] + 1,
    'conditions' => ['plid' => $link['mlid']],
  ]);

  if (!empty($tree)) {
    return $tree;
  }

  return [];
}

/**
 * Implements theme_breadcrumb().
 */
function govcms_ui_kit_breadcrumb($variables) {
  $breadcrumb = $variables['breadcrumb'];
  $output = '';

  if (!empty($breadcrumb)) {
    // Build the breadcrumb trail.
    $output = '<nav class="breadcrumbs" aria-label="breadcrumb">';
    $output .= '<ul><li>' . implode('</li><li>', $breadcrumb) . '</li></ul>';
    $output .= '</nav>';
  }

  return $output;
}

/**
 * Implements hook_form_alter().
 */
function govcms_ui_kit_form_alter(&$form, &$form_state, $form_id) {
  if ($form_id === 'search_api_page_search_form_default_search') {
    // Global header form.
    $form['keys_1']['#attributes']['placeholder'] = t('Search NABERS');
    $form['keys_1']['#title'] = t('Search field');
  }
  elseif ($form_id === 'search_api_page_search_form') {
    // Search page (above results) form.
    $form['form']['keys_1']['#title'] = t('Search NABERS');
  }
  if ($form_id === 'search_form') {
    // Search form on page not found (404 page).
    $form['basic']['keys']['#title'] = t('Search NABERS');
  }

  // Show webform assistance message.
  if (strpos($form_id, 'webform_client_form') !== FALSE) {
    if (theme_get_setting('govcms_ui_kit_show_webform_assistance') === 1) {
      $form['submitted']['required_fields_notification'] = [
        '#weight' => -1,
        '#markup' => '<p class="form-help-text">' . t('Fields marked <span class="form-required">*</span> are required.') . '</p>',
      ];
    }
  }
}

/**
 * Implements hook_form_FORM_ID_alter().
 */
function govcms_ui_kit_form_views_exposed_form_alter(&$form, &$form_state) {
  // Changes exposed form of Assessor Search to horizontal tabs [NAB-95].
  if ($form['#id'] == 'views-exposed-form-assessor-search-api-page') {
    $form['filters'] = [
      '#type' => 'horizontal_tabs',
      '#tree' => FALSE,
      '#prefix' => '<div id="assessor-search-filters">',
      '#suffix' => '</div>',
      '#attached' => [
        'library' => [
          ['field_group', 'horizontal-tabs'],
        ],
      ],
    ];

    $form['filters']['tab_details'] = [
      '#type' => 'fieldset',
      '#title' => t('Rating details'),
      '#attributes' => ['class' => ['search-by-rating-details']],
      '#collapsible' => TRUE,
      '#collapsed' => FALSE,
      '#group' => 'group_tabs',
    ];

    $form['filters']['tab_details']['form_elements'] = [
      '#type' => 'item',
    ];

    $form['filters']['tab_details']['form_elements']['location'] = $form['location'];
    $form['filters']['tab_details']['form_elements']['location']['#title'] = $form['#info']['filter-field_assessor_availability']['label'];
    $form['filters']['tab_details']['form_elements']['location']['#group'] = 'tab_details';
    $form['filters']['tab_details']['form_elements']['location']['#options']['All'] = t('Building location');
    $states = [
      'ACT' => t('Australian Capital Territory'),
      'NSW' => t('New South Wales'),
      'NT' => t('Northern Territory'),
      'QLD' => t('Queensland'),
      'SA' => t('South Australia'),
      'VIC' => t('Victoria'),
      'TAS' => t('Tasmania'),
      'WA' => t('Western Australia'),
    ];
    foreach ($form['filters']['tab_details']['form_elements']['location']['#options'] as &$option) {
      if (isset($states[$option])) {
        $option = $states[$option];
      }
    }

    $form['filters']['tab_details']['form_elements']['rating_type'] = $form['rating_type'];
    $form['filters']['tab_details']['form_elements']['rating_type']['#title'] = $form['#info']['filter-field_assessor_rating_type']['label'];
    $form['filters']['tab_details']['form_elements']['rating_type']['#group'] = 'tab_details';
    $form['filters']['tab_details']['form_elements']['rating_type']['#options']['All'] = t('Rating type');

    $form['filters']['tab_details']['form_elements']['building_type'] = $form['building_type'];
    $form['filters']['tab_details']['form_elements']['building_type']['#title'] = $form['#info']['filter-field_assessor_building_type']['label'];
    $form['filters']['tab_details']['form_elements']['building_type']['#group'] = 'tab_details';
    $form['filters']['tab_details']['form_elements']['building_type']['#options']['All'] = t('Building type');

    $form['filters']['tab_details']['description'] = [
      '#prefix' => '<div id="assessor-filters-details-description"><p class="notes">',
      '#markup' => t('Use the filters to find assessors who match your rating type'),
      '#suffix' => '</p></div>',
    ];

    $form['filters']['tab_details']['submit'] = $form['submit'];

    $form['filters']['tab_name'] = [
      '#type' => 'fieldset',
      '#title' => t('Assessor or company name'),
      '#attributes' => ['class' => ['search-by-name']],
      '#collapsible' => TRUE,
      '#collapsed' => TRUE,
      '#group' => 'group_tabs',
    ];

    $form['filters']['tab_name']['form_elements'] = [
      '#type' => 'item',
    ];

    $form['filters']['tab_name']['form_elements']['name'] = $form['name'];
    $form['filters']['tab_name']['form_elements']['name']['#title'] = $form['#info']['filter-search_api_views_fulltext']['label'];
    $form['filters']['tab_name']['form_elements']['name']['#group'] = 'tab_name';
    $form['filters']['tab_name']['form_elements']['name']['#attributes']['placeholder'] = t('Enter assessor or company name');

    $form['filters']['tab_name']['submit_name'] = $form['submit'];
    $form['filters']['tab_name']['submit_name']['#name'] = 'submit_name';
    $form['filters']['tab_name']['submit_name']['#id'] .= '-name';

    $form['#info'] = [];
    $form['submit'] = [];
    $form['name'] = [];
    $form['location'] = [];
    $form['rating_type'] = [];
    $form['building_type'] = [];

    array_unshift($form['#validate'], 'govcms_ui_kit_views_exposed_form_assessor_search_api_page_validate');
  }

  // Changes exposed form of Commitment Agreements to horizontal tabs [NAB-95].
  if ($form['#id'] == 'views-exposed-form-commitment-agreements-page') {
    $form['#prefix'] = '<div class="form-prefix">';
    $form['#prefix'] .= '<p class="search-by">';
    $form['#prefix'] .= t('Search by');
    $form['#prefix'] .= '</p>';

    // Add Download CSV link.
    try {
      /** @var \FeedsSource $source */
      $feeds_source = feeds_source('commitment_agreement_importer');
      if ($feeds_source) {
        $feeds_config = $feeds_source->getConfig();
        $fetcher = $feeds_config['FeedsFileFetcher'];
        if (!empty($fetcher['source'])) {
          $csv_url = file_create_url($fetcher['source']);
          $csv_link = l('<span>Download all commitment agreements (CSV)</span>', $csv_url, [
            'attributes' => [
              'title' => t('Download all commitment agreements (CSV)'),
            ],
            'html' => TRUE,
          ]);
          $csv = file_load($fetcher['fid']);
          if ($csv) {
            $csv_size = format_size($csv->filesize);
            $csv_link .= ' <span class="file-size">(' . $csv_size . ')</span>';
          }
          $prefix = <<<PREFIX
          <div id="commitment-agreements-download-csv" class="field field-type-file">
            <span class="file">
              <span class="file-icon-wrapper"></span>
                $csv_link
            </span>
          </div>
PREFIX;
          $form['#prefix'] .= $prefix;
        }
      }
    }
    catch (\Exception $e) {
      // Do nothing.
      watchdog_exception('nabers', $e);
    }
    $form['#prefix'] .= '</div>';

    $form['filters'] = [
      '#type' => 'horizontal_tabs',
      '#tree' => FALSE,
      '#prefix' => '<div id="commitment-agreements-filters">',
      '#suffix' => '</div>',
      '#attached' => [
        'library' => [
          ['field_group', 'horizontal-tabs'],
        ],
      ],
    ];

    $form['filters']['tab_building'] = [
      '#type' => 'fieldset',
      '#title' => t('Building details'),
      '#attributes' => ['class' => ['search-by-building-details']],
      '#collapsible' => TRUE,
      '#collapsed' => FALSE,
      '#group' => 'group_tabs',
    ];

    $form['filters']['tab_building']['form_elements'] = [
      '#type' => 'item',
    ];

    $form['filters']['tab_building']['form_elements']['building'] = $form['building'];
    $form['filters']['tab_building']['form_elements']['building']['#title'] = $form['#info']['filter-search_api_views_fulltext']['label'];
    $form['filters']['tab_building']['form_elements']['building']['#group'] = 'tab_building';
    $form['filters']['tab_building']['form_elements']['building']['#attributes']['placeholder'] = $form['#info']['filter-search_api_views_fulltext']['label'];

    $form['filters']['tab_building']['submit'] = [
      '#type' => 'container',
      '#attributes' => ['class' => ['submit-button-wrapper']],
      'submit' => $form['submit'],
    ];

    $form['filters']['tab_signatory'] = [
      '#type' => 'fieldset',
      '#title' => t('Signatory details'),
      '#attributes' => ['class' => ['search-by-signatory']],
      '#collapsible' => TRUE,
      '#collapsed' => TRUE,
      '#group' => 'group_tabs',
    ];

    $form['filters']['tab_signatory']['form_elements'] = [
      '#type' => 'item',
    ];

    $form['filters']['tab_signatory']['form_elements']['signatory'] = $form['signatory'];
    $form['filters']['tab_signatory']['form_elements']['signatory']['#title'] = $form['#info']['filter-search_api_views_fulltext_1']['label'];
    $form['filters']['tab_signatory']['form_elements']['signatory']['#group'] = 'tab_signatory';
    $form['filters']['tab_signatory']['form_elements']['signatory']['#attributes']['placeholder'] = $form['#info']['filter-search_api_views_fulltext_1']['label'];

    $form['filters']['tab_signatory']['submit_signatory'] = [
      '#type' => 'container',
      '#attributes' => ['class' => ['submit-button-wrapper']],
      'submit' => $form['submit'],
    ];

    $form['filters']['tab_signatory']['submit_signatory']['#name'] = 'submit_signatory';
    $form['filters']['tab_signatory']['submit_signatory']['#id'] .= '-signatory';

    unset($form['#info']);
    unset($form['submit']);
    unset($form['building'], $form['signatory']);

    array_unshift($form['#validate'], 'govcms_ui_kit_views_exposed_form_commitment_agreements_search_api_page_validate');
  }
}

/**
 * Implements hook_form_validate().
 */
function govcms_ui_kit_views_exposed_form_assessor_search_api_page_validate(&$form, &$form_state) {
  $values = &$form_state['values'];
  if ($values['filters__active_tab'] == 'edit-tab-name') {
    unset($values['location'], $values['rating_type'], $values['building_type']);
    unset($form['filters']['tab_details']['location']['#value']);
    unset($form['filters']['tab_details']['rating_type']['#value']);
    unset($form['filters']['tab_details']['building_type']['#value']);
  }
  else {
    unset($values['name']);
    unset($form['filters']['tab_name']['name']['#value']);
  }
}

/**
 * Implements hook_form_validate().
 */
function govcms_ui_kit_views_exposed_form_commitment_agreements_search_api_page_validate(&$form, &$form_state) {
  $values = &$form_state['values'];
  if (!empty($values['filters__active_tab']) && $values['filters__active_tab'] == 'edit-tab-signatory') {
    unset($values['building']);
    unset($form['filters']['tab_building']['building']['#value']);
  }
  else {
    unset($values['signatory']);
    unset($form['filters']['tab_signatory']['signatory']['#value']);
  }
}

/**
 * Implements theme_preprocess_search_api_page_result().
 */
function govcms_ui_kit_preprocess_search_api_page_result(&$variables) {
  // Strip out HTML tags from search results.
  $variables['snippet'] = strip_tags($variables['snippet']);
  // Remove the author / date from the result display.
  $variables['info'] = '';
}

/**
 * Implements theme_preprocess_search_result().
 */
function govcms_ui_kit_preprocess_search_result(&$variables) {
  // Strip out HTML tags from search results (404 page).
  $variables['snippet'] = strip_tags($variables['snippet']);
  // Remove the author / date from the result display (404 page).
  $variables['info'] = '';
}

/**
 * Implements theme_image().
 */
function govcms_ui_kit_image($variables) {
  $attributes = $variables['attributes'];
  $attributes['src'] = file_create_url($variables['path']);

  foreach (['width', 'height', 'alt', 'title'] as $key) {
    if (isset($variables[$key])) {
      $attributes[$key] = $variables[$key];
    }
  }

  if (empty($attributes['alt'])) {
    $attributes['alt'] = '';
  }

  return '<img' . drupal_attributes($attributes) . ' />';
}

/**
 * Implement theme_webform_grid().
 */
function govcms_ui_kit_webform_grid($variables) {
  $element = $variables['element'];
  $right_titles = _webform_grid_right_titles($element);

  $rows = [];
  $title = ['data' => '', 'class' => ['webform-grid-question']];
  $header = [$title];
  // Set the header for the table.
  foreach ($element['#grid_options'] as $option) {
    $header[] = [
      'data' => webform_filter_xss($option),
      'class' => ['checkbox', 'webform-grid-option'],
    ];
  }
  if ($right_titles) {
    $header[] = $title;
  }

  foreach (element_children($element) as $key) {
    $question_element = $element[$key];
    $question_titles = explode('|', $question_element['#title'], 2);

    // Create a row with the question title.
    $title = [
      'data' => webform_filter_xss($question_titles[0]),
      'class' => ['webform-grid-question'],
      'header' => TRUE,
    ];
    $row = [$title];

    // Render each radio button in the row.
    $radios = form_process_radios($question_element);
    foreach (element_children($radios) as $key) {
      $radios[$key]['#title'] = $question_element['#title'] . ' - ' . $radios[$key]['#title'];
      $radios[$key]['#title_display'] = 'invisible';
      $row[] = [
        'data' => drupal_render($radios[$key]),
        'class' => ['checkbox', 'webform-grid-option'],
      ];
    }
    if ($right_titles) {
      $row[] = [
        'data' => isset($question_titles[1]) ? webform_filter_xss($question_titles[1]) : '',
        'class' => ['webform-grid-question'],
      ];
    }
    $rows[] = $row;
  }

  $option_count = count($header) - 1;
  return theme('table', [
    'header' => $header,
    'rows' => $rows,
    'sticky' => $element['#sticky'],
    'attributes' => [
      'class' => [
        'webform-grid',
        'webform-grid-' . $option_count,
      ],
    ],
  ]);
}

/**
 * Implements hook_preprocess_username().
 */
function govcms_ui_kit_preprocess_username(&$variables) {
  unset($variables['attributes_array']['xml:lang']);
}

/**
 * Implements hook_block_view_alter().
 */
function govcms_ui_kit_block_view_alter(&$data, $block) {
  if ($block->module == 'govcms_social_links' && $block->delta == 'services') {
    // Replace social link icons.
    foreach ($data['content'] as $service => $content) {
      $icon = drupal_get_path('theme', 'govcms_ui_kit') . '/dist/images/svg/social-' . $service . '.svg';
      if (@file_exists($icon)) {
        $data['content'][$service]['#icon'] = $icon;
      }
    }
  }
}

/**
 * Implements hook_preprocess_entity().
 */
function govcms_ui_kit_preprocess_entity(&$variables) {
  if (!empty($variables['elements']['#entity'])) {
    $entity = $variables['elements']['#entity'];
    $entity_type = $variables['elements']['#entity_type'];
    $bundle = $variables['elements']['#bundle'];
    $functions = [
      "govcms_ui_kit_preprocess_entity__{$entity_type}",
      "govcms_ui_kit_preprocess_entity__{$entity_type}__{$bundle}",
    ];
    foreach ($functions as $function) {
      if (function_exists($function)) {
        $function($variables, $entity);
      }
    }
  }
}

/**
 * Implements hook_preprocess_entity().
 *
 * @see govcms_ui_kit_preprocess_entity()
 */
function govcms_ui_kit_preprocess_entity__bean__nabers_tools(&$variables, $entity) {
  $variables['bg_img_url'] = '';
  $variables['call_to_action_url'] = ['link_title' => '', 'link_url' => ''];
  if (!empty($entity->field_bean_image[LANGUAGE_NONE][0]['uri'])) {
    $variables['bg_img_url'] = file_create_url($entity->field_bean_image[LANGUAGE_NONE][0]['uri']);
  }
  if (!empty($entity->field_call_to_action_link[LANGUAGE_NONE][0])) {
    $field = $entity->field_call_to_action_link[LANGUAGE_NONE][0];
    $link_url = !empty($field['display_url']) ? $field['display_url'] : '';
    $link_title = !empty($field['title']) ? $field['title'] : '';
    $variables['call_to_action_url'] = [
      'link_title' => $link_title,
      'link_url' => $link_url,
    ];
  }
}

/**
 * Implements hook_preprocess_entity().
 *
 * @see govcms_ui_kit_preprocess_entity()
 */
function govcms_ui_kit_preprocess_entity__paragraphs_item__link_with_image(&$variables, $entity) {
  $host_entity = $entity->hostEntityBundle();
  $variables['wrapper_link'] = ['link_title' => '', 'link_url' => ''];
  if ($host_entity != 'nabers_tools') {
    return;
  }
  if (!empty($entity->field_link_to[LANGUAGE_NONE][0])) {
    $field = $entity->field_link_to[LANGUAGE_NONE][0];
    $link_url = !empty($field['display_url']) ? $field['display_url'] : '';
    $link_title = !empty($field['title']) ? $field['title'] : '';
    $variables['wrapper_link'] = [
      'link_title' => $link_title,
      'link_url' => $link_url,
    ];
  }
}

/**
 * Implements hook_preprocess_paragraph().
 */
function govcms_ui_kit_preprocess_entity__paragraphs_item(&$variables, $entity) {
  $bundle = $entity->bundle();
  $supported_bundles = [
    'data_reports' => 'field_data_gallery',
    'featured_data_reports' => 'field_featured_data_gallery',
  ];
  // Add item count to data reports paragraphs.
  if (isset($supported_bundles[$bundle])) {
    if (!empty($variables['content'][$supported_bundles[$bundle]]['#items'])) {
      $count = count($variables['content'][$supported_bundles[$bundle]]['#items']);
      if ($count) {
        $variables['classes_array'][] = 'data-gallery-count-' . $count;
      }
    }
  }
  if ($bundle === 'featured_data_reports') {
    // Override what is rendered in featured data reports.
    $items = [];
    foreach ($entity->field_featured_data_gallery[LANGUAGE_NONE] as $key => $item) {
      $node = $entity->field_featured_data_gallery[LANGUAGE_NONE][$key]['entity'];
      $items[$key]['featured_image'] = field_view_field('node', $node, 'field_data_image', 'compact');
      $items[$key]['body'] = field_view_field('node', $node, 'body', 'compact');
      $items[$key]['featured_title'] = $node->title;
      $items[$key]['featured_subtitle'] = $variables['content']['field_featured_data_label'];
      $link = [
        'text' => t('See more'),
        'path' => 'node/' . $node->nid,
        'options' => [
          'attributes' => [],
        ],
      ];
      $items[$key]['link_to'] = theme('link', $link);

      if (!empty($node->field_data_category)) {
        $term = taxonomy_term_load($node->field_data_category[$node->language][0]['tid']);
        if (is_object($term)) {
          $items[$key]['data_category'] = $term->name;
        }
      }
    }
    $variables['content']['items'] = $items;
  }
}

/**
 * Implements hook_preprocess_page().
 */
function govcms_ui_kit_preprocess_page(&$variables) {
  // Wrap the separate facet api blocks on Commitment Agreement page with a div
  // for styling purposes.
  $is_view_page = views_get_page_view();
  if (is_object($is_view_page) && $is_view_page->name === 'commitment_agreements' && !empty($variables['page']['content'])) {
    $content_blocks = $variables['page']['content'];
    $is_first = TRUE;
    foreach ($content_blocks as $key => &$element) {
      $is_facet_block = FALSE;
      if (strpos($key, 'facetapi_') === 0) {
        $is_facet_block = TRUE;
        if ($is_first) {
          $element['#prefix'] = '<div class="commitment-agreement-facets"><div class="content">';
          $is_first = FALSE;
        }
      }
      // Add close the div if the next element is not a facet api block.
      $next_element = next($variables['page']['content']);
      if ($is_facet_block && empty($next_element['#facet'])) {
        $element['#suffix'] = "</div></div>";
      }
    }
    $variables['page']['content'] = $content_blocks;
  }

  if (!empty($variables['node'])) {
    $node = $variables['node'];
    if (in_array($node->type, CONTENT_WITH_IMAGE)) {
      $variables['article_image'] = field_view_field('node', $node, 'field_image', 'default');
    }
    if (in_array($node->type, CONTENT_WITH_DATE)) {
      $variables['article_date'] = field_view_field('node', $node, 'field_date', 'default');
    }
    if ($node->type === 'data_landing_page') {
      $variables['featured_data_reports'] = field_view_field('node', $node, 'field_landing_featured_reports', 'default');
    }
  }
  // Add static form for Global Search [NAB-71].
  if (empty($variables['page']['header'])) {
    // The header region has no block, needs to construct it.
    $variables['page']['header'] = [
      '#theme_wrappers' => ['region'],
      '#region' => 'header',
    ];
  }
  $variables['page']['header']['search_form']['#markup'] = <<<SEARCHFORM
  
          <div id="block-search-api-page-default-search" class="block block-search-api-page contextual-links-region">
            <div class="content">
              <form class="search-form-widget" action="/search" method="get" id="search-api-page-search-form-default-search" accept-charset="UTF-8" _lpchecked="1">
                <div>
                  <div class="form-item form-type-textfield form-item-keys-1">
                    <label class="element-invisible" for="edit-keys-1">Search field </label>
                    <input placeholder="Search NABERS" type="text" id="edit-keys-1" name="search" value="" size="15" maxlength="128" class="form-text">
                  </div>
                  <input type="submit" id="edit-submit-1" name="op" value="Search" class="form-submit">
                </div>
              </form>
            </div>
          </div>

SEARCHFORM;
}

/**
 * Implements theme_govcms_social_link().
 */
function govcms_ui_kit_govcms_social_link(&$variables) {
  $class = drupal_clean_css_identifier(drupal_strtolower($variables['title']));
  return theme('link', [
    'text' => $variables['title'],
    'path' => $variables['url'],
    'options' => [
      'html' => TRUE,
      'attributes' => [
        'class' => [$class],
      ],
    ],
  ]);
}

/**
 * Implements hook_preprocess_file_entity().
 */
function govcms_ui_kit_preprocess_file_entity(&$variables) {
  $variables['theme_hook_suggestions'][] = 'file_entity__inline_wysiwyg';
}

/**
 * Implements theme_file_icon().
 */
function govcms_ui_kit_file_icon($variables) {
  $file = $variables['file'];
  $alt = $variables['alt'];
  $icon_directory = path_to_theme('govcms_ui_kit') . '/dist/images/png/icons';

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
 * Implements hook_preprocess_views_view().
 */
function govcms_ui_kit_preprocess_views_view(&$variables) {
  $view = $variables['view'];
  $search_keyword = _govcms_ui_kit_get_search_keyword();

  if (!empty($search_keyword)) {
    $search_keyword = t('Search results for "@keyword"', ['@keyword' => $search_keyword]);
  }

  if (empty($search_keyword) && $view->name == 'publication_search_api') {
    $search_keyword = t('Search publications');
  }

  $variables['search_keyword'] = $search_keyword;
}

/**
 * Helper function to return any active search keyword.
 *
 * @return string|bool
 *   Search keyword or FALSE.
 */
function _govcms_ui_kit_get_search_keyword() {
  $params = drupal_get_query_parameters();
  return !empty($params['search']) ? check_plain($params['search']) : '';
}

/**
 * Implements theme_facetapi_count().
 */
function govcms_ui_kit_facetapi_count($variables) {
  return '<span class="facetapi-count">' . (int) $variables['count'] . '</span>';
}

/**
 * Implements theme_facetapi_link_inactive().
 */
function govcms_ui_kit_facetapi_link_inactive($variables) {
  // Builds accessible markup.
  // @see http://drupal.org/node/1316580
  $accessible_vars = [
    'text' => $variables['text'],
    'active' => FALSE,
  ];
  $accessible_markup = theme('facetapi_accessible_markup', $accessible_vars);

  // Sanitizes the link text if necessary.
  $sanitize = empty($variables['options']['html']);
  $variables['text'] = ($sanitize) ? check_plain($variables['text']) : $variables['text'];
  $variables['text'] = format_string('<span class="facet-link-text">@text</span>', ['@text' => $variables['text']]);

  // Adds count to link if one was passed.
  $item_count = '';
  if (isset($variables['count'])) {
    $item_count = theme('facetapi_count', $variables);
  }

  // Resets link text, sets to options to HTML since we already sanitized the
  // link text and are providing additional markup for accessibility.
  $variables['text'] .= $accessible_markup . $item_count;
  $variables['options']['html'] = TRUE;

  return theme('link', $variables);
}

/**
 * Implements theme_facetapi_link_active().
 */
function govcms_ui_kit_facetapi_link_active($variables) {
  // Sanitizes the link text if necessary.
  $sanitize = empty($variables['options']['html']);
  $facet_label = ($sanitize) ? check_plain($variables['text']) : $variables['text'];

  // Theme function variables fro accessible markup.
  // @see http://drupal.org/node/1316580
  $accessible_vars = [
    'text' => $variables['text'],
    'active' => TRUE,
  ];

  $facet_label = format_string('<span class="facetapi-label">!link_text</span>', ['!link_text' => $facet_label]);
  if (isset($variables['count'])) {
    $facet_label .= theme('facetapi_count', $variables);
  }

  // Builds link, passes through t() which gives us the ability to change the
  // position of the widget on a per-language basis.
  $replacements = [
    '!facetapi_deactivate_widget' => theme('facetapi_deactivate_widget', $variables),
    '!facetapi_accessible_markup' => theme('facetapi_accessible_markup', $accessible_vars),
  ];
  $variables['text'] = format_string('!facetapi_deactivate_widget !facetapi_accessible_markup', $replacements);
  $variables['options']['html'] = TRUE;
  $link = theme('link', $variables);

  return $link . $facet_label;
}

/**
 * Implements template_preprocess_block().
 */
function govcms_ui_kit_preprocess_block(&$variables) {
  $block = $variables['block'];
  if ($block->module === 'facetapi') {
    $facet_api_deltas = facetapi_get_delta_map();
    if (isset($facet_api_deltas[$block->delta])) {
      list($searcher) = facetapi_parse_delta($facet_api_deltas[$block->delta]);
      if ($searcher == 'search_api@commitment_agreement_index') {
        $variables['clear_filters'] = '';
      }
      else {
        $query = ['search' => _govcms_ui_kit_get_search_keyword()];
        $options = ['query' => $query];
        $variables['clear_filters'] = l(t('Clear all'), current_path(), $options);
      }
    }
  }
  if ($block->delta == 'self-rating-calculators') {
    // Add Polyfill to support IE.
    drupal_add_js('https://cdn.polyfill.io/v2/polyfill.min.js', [
      'type' => 'external',
      'scope' => 'footer',
    ]);

    $api['apiURL'] = !empty(theme_get_setting('govcms_ui_kit_rating_calculator_api_url')) ? theme_get_setting('govcms_ui_kit_rating_calculator_api_url') : '';
    $api['authURL'] = !empty(theme_get_setting('govcms_ui_kit_rating_calculator_authentication_url')) ? theme_get_setting('govcms_ui_kit_rating_calculator_authentication_url') : '';
    $api['clientID'] = !empty(theme_get_setting('govcms_ui_kit_rating_calculator_client_id')) ? theme_get_setting('govcms_ui_kit_rating_calculator_client_id') : '';
    $api['clientSecret'] = !empty(theme_get_setting('govcms_ui_kit_rating_calculator_client_secret')) ? theme_get_setting('govcms_ui_kit_rating_calculator_client_secret') : '';

    drupal_add_js(['govcms_ui_kit' => ['rating_calculators_api' => $api]], ['type' => 'setting']);

    // Add self-rating calculators JS file.
    drupal_add_js(drupal_get_path('theme', 'govcms_ui_kit') . '/self-rating-calculators/dist/static/js/manifest.js', ['scope' => 'footer']);
    drupal_add_js(drupal_get_path('theme', 'govcms_ui_kit') . '/self-rating-calculators/dist/static/js/vendor.js', ['scope' => 'footer']);
    drupal_add_js(drupal_get_path('theme', 'govcms_ui_kit') . '/self-rating-calculators/dist/static/js/app.js', ['scope' => 'footer']);
  }
}

/**
 * Implements hook_field_attach_view_alter().
 *
 * Required to show field labels for Assessor & Commitment agreement content
 * types in teaser mode even if the field is empty [NAB-97] & [NAB-113].
 */
function govcms_ui_kit_field_attach_view_alter(&$output, $context) {
  if (!_govcms_ui_kit_render_empty_field($context)) {
    return;
  }

  $node = $context['entity'];

  // Load field instances.
  $instances = _field_invoke_get_instances('node', $node->type, [
    'default' => TRUE,
    'deleted' => FALSE,
  ]);

  foreach ($instances as $field_name => $instance) {
    // Set the content if the field is empty.
    if (empty($node->{$field_name})) {
      $display = field_get_display($instance, 'teaser', $node);
      // Do not add the field if hidden in the view mode settings.
      if ($display['type'] == 'hidden') {
        continue;
      }
      // Load field settings.
      $field = field_info_field($field_name);
      // Create the render array for the field.
      $output[$field_name] = [
        '#theme' => 'field',
        '#title' => $instance['label'],
        '#label_display' => $display['label'],
        '#field_type' => $field['type'],
        '#field_name' => $field_name,
        '#bundle' => $node->type,
        '#object' => $node,
        '#items' => [],
        '#entity_type' => 'node',
        '#weight' => $display['weight'],
        0 => ['#markup' => '&nbsp;'],
      ];
    }
  }
}

/**
 * Checks whether a field should be rendered even when it's empty.
 *
 * @param array $context
 *   Context of a field.
 *
 * @return bool
 *   True if the conditions are met.
 *
 * @see govcms_ui_kit_field_attach_view_alter()
 */
function _govcms_ui_kit_render_empty_field(array $context) {
  $content_types = ['assessor', 'commitment_agreement'];
  return !empty($context['entity']->type)
    && in_array($context['entity']->type, $content_types)
    && $context['view_mode'] = 'teaser';
}
