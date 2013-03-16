<?php
$HUDKIT_STYLESHEETS = array(
  'reset.css',
  'hudkit.css',
);

$HUDKIT_JAVASCRIPTS = array(
  'hudkit.js',
  'action.js',
  'widget.js',
  'box.js',
  'root-pane.js',
  'split-pane.js',
  'console/console.js',
  'dialog/dialog.js',
  'canvas/canvas2d.js',
);
?>

<? foreach ($HUDKIT_STYLESHEETS as $css) { ?>
  <link rel='stylesheet' href='<?= $HUDKIT_BASE ?><?= $css ?>'></link>
<? } ?>
<? foreach ($HUDKIT_JAVASCRIPTS as $js) { ?>
  <script src='<?= $HUDKIT_BASE ?><?= $js ?>'></script>
<? } ?>
