<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');
function answer(int $code,string $message):never{http_response_code($code);echo json_encode(['message'=>$message],JSON_UNESCAPED_UNICODE);exit;}
if($_SERVER['REQUEST_METHOD']!=='POST')answer(405,'Метод не поддерживается.');
$origin=(string)($_SERVER['HTTP_ORIGIN']??'');$requestHost=preg_replace('/:\d+$/','',(string)($_SERVER['HTTP_HOST']??''));
if($origin!==''&&parse_url($origin,PHP_URL_HOST)!==$requestHost)answer(403,'Источник запроса не разрешён.');
if(!empty($_POST['website']??''))answer(200,'Заявка отправлена.');
if(($_POST['consent']??'')!=='yes')answer(422,'Подтвердите согласие на обработку данных.');
$name=trim((string)($_POST['name']??''));$phone=trim((string)($_POST['phone']??''));$time=trim((string)($_POST['time']??'Не указано'));
if($name===''||mb_strlen($name)>60)answer(422,'Проверьте имя.');
if(!preg_match('/^[0-9+()\-\s]{7,24}$/u',$phone))answer(422,'Проверьте номер телефона.');
$mailTo=getenv('MAIL_TO')?:'';
if(!filter_var($mailTo,FILTER_VALIDATE_EMAIL))answer(503,'Отправка на Яндекс-почту пока не настроена.');
$rateFile=sys_get_temp_dir().DIRECTORY_SEPARATOR.'apostolkov_'.hash('sha256',(string)($_SERVER['REMOTE_ADDR']??'unknown'));
if(is_file($rateFile)&&time()-(int)filemtime($rateFile)<30)answer(429,'Повторите отправку через 30 секунд.');
@touch($rateFile);
$clean=static fn(string $value):string=>preg_replace('/[\r\n]+/u',' ',$value);
$body="Имя: ".$clean($name)."\nТелефон: ".$clean($phone)."\nУдобное время: ".$clean($time)."\nСогласие: получено\nДата: ".date('d.m.Y H:i');
$host=preg_replace('/[^a-z0-9.-]/i','',$requestHost)?:'apostolkov.ru';
$headers=['From: site@'.$host,'Content-Type: text/plain; charset=UTF-8','X-Mailer: PHP/'.PHP_VERSION];
$subject='=?UTF-8?B?'.base64_encode('Новая заявка с сайта АпотолковЪ').'?=';
if(!mail($mailTo,$subject,$body,implode("\r\n",$headers)))answer(502,'Сервер не смог отправить письмо.');
answer(200,'✓ Заявка отправлена! Мы свяжемся с вами.');
