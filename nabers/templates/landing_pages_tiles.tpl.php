<?php

/**
 * @file
 * Template file for Landing page tiles.
 */
?>
<div id="landing-page-tiles">
  <div class="landing-page-tiles-wrapper">
    <?php foreach ($items as $item): ?>
      <div class="landing-page-tile">
        <?php print render($item) ?>
      </div>
    <?php endforeach; ?>
  </div>
</div>
