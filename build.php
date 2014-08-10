<?

if(isset($_GET['build'])) $build = $_GET['build']; else $build = "full";

$manifest = array(
  "script/utils.js",

  "script/3rd/canvasquery.js",
  "script/3rd/canvasquery.extensions.js",

  "script/ENGINE.js",
  
  "script/engine",
  "script/modules",
  "script/components",
  "script/entities",

  "script/main.js",
  
  "script/app",
);


  $builds = [];

  $builds['full'] = [
    'before' => [],
    'after' => []
  ];


  $inline = "";

  function includeFolder($dir, &$buffer) {
    if ($handle = opendir($dir)) {
        while (false !== ($entry = readdir($handle))) {
            if ($entry != "." && $entry != "..") {
              $path = "$dir/$entry";

              if(is_dir($path)) {
                includeFolder($path, $buffer);
              } else {
                $buffer .= "/* $path */\n\n";
                $buffer .= file_get_contents($path) . "\n\n";
              }
            }
        }
        closedir($handle);
    }
  }

  function includeScript($url, &$inline) {
    $inline .= "<script src='$url'></script>\n";
  }


  $buffer = "";

  $before = $builds[$build]['before'];
  foreach($before as $script) {
    $buffer .= "/* $script */\n\n";
    $buffer .= file_get_contents($script) . "\n";
    includeScript($script, $inline);
  }

  foreach($manifest as $script) {
      if(is_dir($script)) {
        includeFolder($script, $buffer);
      } else {
       $buffer .= "/* $script */\n\n";
       $buffer .= file_get_contents($script)."\n";
       includeScript($script, $inline);
     }
  }

  $after = $builds[$build]['after'];
  foreach($after as $script) {
    $buffer .= "/* $script */\n\n";    
    $buffer .= file_get_contents($script);
    includeScript($script, $inline);
 }


  @unlink($build.".js");

  file_put_contents($build.".js", $buffer);

  file_put_contents($build.".html", $inline);

  chmod($build.".js", 0777);
  
  echo $buffer;

  // moj piekny ogrod + przepis
