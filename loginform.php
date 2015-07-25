<?php

if(isset($_POST['username'])&&isset($_POST['password'])){
$username=$_POST['username'];
$password=$_POST['password'];

$password_hase=md5($password);

  if(!empty($username)&&!empty($password)){
	$query="select `id` from ynotsadmin where username='".mysql_real_escape_string($username)."' and password='".mysql_real_escape_string($password_hase)."'";
	
	if($query_run=mysql_query($query)){
	   $query_num_rows=mysql_num_rows($query_run);
	   
	   if($query_num_rows==0){
	     echo 'Invalide username/password combination';
	   }else if($query_num_rows==1){
	      $user_id=mysql_result($query_run, 0,'id');
		  $_SESSION['user_id']=$user_id;
		  header('Location: index.php');
	   }
	}
	} 
  else{
	echo "You must supply a username and password";
  }



}

?>

<form action="<?php echo $current_file;?>" method="post">
Username:<input type="text" name="username"><br>
Password:<input type="password" name="password"><br>
<input type="submit" value="Log in">

</form>