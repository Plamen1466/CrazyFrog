<?php

$method = $_SERVER['REQUEST_METHOD'];
$file   = __DIR__ . '/scores.json';
$scores = file_get_contents($file);

if ($method === 'GET') {
	echo $scores;
} else if ($method === 'POST') {
	$scores   = json_decode($scores, TRUE);
	$scores[] = [
		'name'   => $_POST['name'],
		'scores' => (int) $_POST['scores'],
	];

	usort($scores, function($a, $b) {
		$scoresA = $a['scores'];
		$scoresB = $b['scores'];

		if ($scoresA === $scoresB) {
			return 0;
		}

		return $scoresA < $scoresB ? 1 : -1;
 	});

 	$scores = json_encode($scores);

	file_put_contents($file, $scores);

	echo $scores;
} else {
	echo 'Method not allowed.';
}
