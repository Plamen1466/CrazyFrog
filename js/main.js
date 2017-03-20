var chronometer = 200;
var isPressed = true; 
var score = 0;
var id;
var time = 200;
var prev_pos = 0;
$(document).ready(function() {
	var startTime = 200;	// Начално време за реакция на потребителя - 2 секунди
	
	UpdateLeaderBoard(); 	// Първо извеждане на класацията с точки 

	$('td').click( function() {		// При клик върху клетка от тоблицата
		if ( $(this).is( ".board-pull" ) ) {	// Провери дали това е червено поле и ако е червено:
			clearInterval(id);
			id = setInterval(frame, 10);
			chronometer = time;
			console.log("Pressed");
			score++;							// - увеличи точките 
			
			isPressed = true;	
			$(this).removeClass('board-pull');	// - изчисти полето, тъй като то вече е кликнато
			$(this).addClass('board-cell');		// - връщане на класа, че е нормално игрално поле
		}
	})

	$('.btn-start').click(function(){		// При натискане на бутона START
		start(startTime);					// Стартирай играта
		$(this).hide();						// Скрий бутона START
	});

	$('.btn-submit').click(function(){		// При натискане на SUBMIT бутона
		var user_name = prompt("Please enter your name", "");	// Искане потребителя да въведе своето име
		AddScore(user_name, score);								// Добавяне на резултатите на потребителя в класацията
		NewGame();												// Подготовка на нова игра
		UpdateLeaderBoard();		            				// Ъпдейтване на класацията
	});
});

function frame() {
   	if (chronometer == time) {					// Ако хронометъра е стигнал стойността на таймера за текущата итерация
		RandomPosition();						// Генерирай случайна позиция на червеното поле
  		chronometer = 0;						// Нулирай хронометъра за следваща итерация
		time = time - 10;						// Намали таймера
    	//console.log(time);						
		if(time<0)								// Ако случайно някой бие играта (тоест достигне до случая, в който таймера вече е 0)
		{
			isPressed = false;
		}
    	} else {								// Иначе, значи все още тече времето за текущата итерация
      		++chronometer; 						// Увеличи хротометъра
			UpdateProgress(time-chronometer);	// Ъпдейтни точките и оставащото време
      		if(chronometer==time){				// И ако времето изтича
				isPressed = false;				// Свали флага, че играча успешно е натиснал поле
				clearInterval(id);				// Прекрати играта
				var name = prompt("Please enter your name", ""); // Изведи прозорец, където потребителя да въведе своето име
				AddScore(name, score);			// Добави резултата му към класацията
				UpdateLeaderBoard();			// Упдейтни класацията
				NewGame();						// Подготви нова игра
      		}
    	}
	}


function start() {							// Начало на играта
	$('.progress').show();		// Изчисти текущото съдържание на прогреса
	id = setInterval(frame, 10);
}

function UpdateProgress(reaming_time){
	$('.progress').empty();		// Изчисти текущото съдържание на прогреса
	$('.progress').append($('<div>', {text: "Level: " + score +"| Time Left: " + reaming_time/100 + " seconds"}));	// Обнови прогреса		
}

function NewGame(){		// Подготовка на полето за нова игра
	time = 200;			// Връщане на начална стойност на таймера
	chronometer = 200;	// Връщане на началната стойност на хронометъра
	isPressed = true;	// Вдигни флага за успешно натиснато поле
	score = 0;			// Нулирай резултата
	$('.board td').each(function() {		// Обходи игралното поле и изчисти червените полета ако има такива
		$(this).removeClass('board-pull');
		$(this).addClass('board-cell');
	});

	$('.btn-submit').hide();	// Скрий бутона за добавяне в класацията
	$('.btn-start').show();		// Изведи бутона за начало на нова игра
	//alert(time);
}

function RandomPosition() {
	var randomNum = Math.floor(Math.random() * 8);	// Генерирай случайно число в диапазона [0:8]
	while(randomNum == prev_pos)
	{
		var randomNum = Math.floor(Math.random() * 8);	// Генерирай случайно число в диапазона [0:8]
	}
	var randomtd = $('td').eq(randomNum);			// Взимане на съответната клетка
	$(randomtd).parents('table').find('td').each( function( index, element ) {	// Изчистване на стари червени точки от игралното поле
		$(element).removeClass('board-pull');
		$(element).addClass('board-cell');
	});

	randomtd.addClass('board-pull');				// Поставяне на червена точка на новото случайно поле
	prev_pos = randomNum;
}

function AddScore(user_name, score){		// Добавяне на запис в класацията
	if(user_name != "")
	{
		$.ajax({
			type: "POST",
			url: "scores.php",
			data: { name: user_name, scores: score},
			success: function(data){
				//alert('Items added');
			}, 
			error: function(data){
				alert('Items not added');
			}, 
		});
	}
	else return;
}

function UpdateLeaderBoard()				// Извличане на класацията
{	
	$('.leaderboard').empty();
	$.ajax({ 
		type: 'GET', 
		url: 'scores.php', 
		data: { get_param: 'value' }, 
		dataType: 'json',
		success: function (data) { 
			$.each(data, function(index, element) {		// Изведи всеки запис от класацията на нов ре 
				$('.leaderboard').append($('<div>', {text: element.name + " - " + element.scores}));
			});
		}

	});
}

