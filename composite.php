<?php

system("rm -rf tmp/");
mkdir("tmp");

if (is_uploaded_file($_FILES["upfile"]["tmp_name"])) {
  $uploaded_image_path = "tmp/" . $_FILES["upfile"]["name"];
  move_uploaded_file($_FILES["upfile"]["tmp_name"], $uploaded_image_path);
  chmod($uploaded_image_path, 0644);
  if ($_POST["size"] == "400") {
    $soldout_file = 'images/soldout.png';
  } else {
    $soldout_file = 'images/soldout-650x650.png';
  }
  $img1 = new Imagick( $soldout_file );
  $img2 = new Imagick( $uploaded_image_path );

  $img2->compositeImage( $img1, imagick::COMPOSITE_DEFAULT, 0, 0 );

  $composed_image_path = "tmp/" . basename($uploaded_image_path, '.jpg'). 's.jpg';
  $img2->writeImage($composed_image_path);

  header('Content-Type: application/json');
  echo json_encode(array(
    "dir" => "tmp/",
    "filename" => basename($composed_image_path),
    "error" => 0
  ));

} else {
  header('Content-Type: application/json');
  echo json_encode(array(
    "filepath" => "",
    "error" => 1,
    "error_msg" => "ファイルがアップロードされていません"
  ));
}
?>
