<?php
if(isset($_COOKIE['cookies']) && $_COOKIE['cookies'] == '9ee7ee5fe298186d2156339a5a9dbdc3') {
}
else {
    header('Location: page_non_autorisee.php');
    exit;
}
    ?>


<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #000;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }

    form {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -100px;
      margin-left: -250px;
      width: 500px;
      height: 200px;
      border: 4px dashed #fff;
    }

    form p {
      width: 100%;
      height: 100%;
      text-align: center;
      line-height: 170px;
      color: #ffffff;
      font-family: Arial;
    }

    form input {
      position: absolute;
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      outline: none;
      opacity: 0;
    }

    form button {
      margin: 0;
      color: #ffffff;
      background: #16a085;
      border: none;
      width: 508px;
      height: 35px;
      margin-top: -20px;
      margin-left: -4px;
      border-radius: 4px;
      border-bottom: 4px solid #117A60;
      transition: all .2s ease;
      outline: none;
    }

    form button:hover {
      background: #149174;
      color: #0C5645;
    }

    form button:active {
      border: 0;
    }

    p {
      color: white; /* Fix missing color property */
      margin-top: auto; /* Add this to align the text to the bottom */
    }
  </style>
  <title>Image Upload</title>
</head>
<body>

<form action="ultraupload.php" method="post" enctype="multipart/form-data">
    <input type="file" name="fileToUpload" id="fileToUpload">
    <p>Drag your files here or click in this area.</p>
    <button type="submit" value="Upload Image" name="submit">Upload Image</button>
    <script>
        if ( window.history.replaceState ) {
            window.history.replaceState( null, null, window.location.href );
        }
    </script>
  </form>
  <p id="output" style="color: white;"></p>
  <p id="filename" style="color: white;">File chosen: </p>

  <?php
$output = ""; // Define $output before using it
$exiftool_output = "";

if(isset($_POST["submit"])) {
  $target_dir = "uploadsALLFILESXDDD/";
  $target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
  $uploadOk = 1;
  $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

  // Check if image file is a actual image or fake image
  $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
  if($check !== false) {
    $uploadOk = 1;
  } else {
    $output = "File is not an image.\n";
    $uploadOk = 0;
  }

  // Check if file already exists
  if (file_exists($target_file)) {
    $output .= "File already exists.\n";
    $uploadOk = 0;
  }

  if ($_FILES["fileToUpload"]["size"] > 500000) {
    $output .= "Sorry, your file is too large.\n";
    $uploadOk = 0;
  }

  $imageFileType = pathinfo($_FILES["fileToUpload"]["name"], PATHINFO_EXTENSION);
  if (!in_array($imageFileType, array("jpg", "jpeg", "png", "gif"))) {
  $output .= "Sorry, only JPG, JPEG, PNG & GIF files are allowed.\n";
    $uploadOk = 0;
  }

  if ($uploadOk == 0) {
    $output .= "Sorry, your file was not uploaded.\n";
  } else {
    if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
      $output .= "The file ". htmlspecialchars(basename($_FILES["fileToUpload"]["name"])). " has been uploaded.\n";
      $exiftool_output = shell_exec("exiftool " . $target_file); 
      unlink($target_file);
    } else {
      $output .= "Sorry, there was an error uploading your file.\n";
    }
  }
} 
?>

<script>
    var paragraph = document.getElementById("output");
    paragraph.textContent = "<?php echo $output; ?>" + "\n" + "<?php echo $exiftool_output; ?>";

    document.getElementById("fileToUpload").addEventListener("change", function(e) {
        document.getElementById("filename").textContent = "File chosen: " + this.files[0].name;
    });
</script>


</body>
</html>
