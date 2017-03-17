var isPressed = true; 
var score = 0;

$(document).ready(function() {
	var startTime = 2000;	// Начално време за реакция на потребителя - 2 секунди
	
	UpdateLeaderBoard(); 	// Първо извеждане на класацията с точки 

	$('td').click( function() {		// При клик върху клетка от тоблицата
		if ( $(this).is( ".board-pull" ) ) {	// Провери дали това е червено поле и ако е червено:
			//isPressed = true;					// - вдигни флага, че е натиснато поле
			score++;							// - увеличи точките 
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


async function start(time) {					// Начало на играта
	while(isPressed){							// Докато потребителя не допусне грешка
		$('.progress').show();					// Извеждане на текущия резултат и оставащото време
		RandomPosition();						// Генерирай случайна позиция на червеното поле
		Timer(time);							// Пускане на таймера с текущото време за итерацията
		await sleep(time);						// Стартиране на таймер за изчакване
		time = time-100;						// След това, таймера се намалява, за да може на следващата итерация да бъде по-малко времето за реакция

		$('.board td').each(function() {		// След изтичане на времето обходи игралното поле
			if($(this).is(".board-pull")){		// Ако има останали червени полета
				isPressed = false;				// Смъкни флага, показващ, че потребителя е кликнал върху полето, което ще прекрати играта 
				$('.btn-submit').show();		// Визуализирай бутона за запазване на резултата	

			}    
		});
	}
}
async function Timer(reaming_time){
	while(reaming_time >= 0){		// Докато оставащото време е повече от 0
		$('.progress').empty();		// Изчисти текущото съдържание на прогреса
		$('.progress').append($('<div>', {text: "Level: " + score +"| Time Left: " + reaming_time/1000 + " seconds"}));	// Обнови прогреса	
		reaming_time = reaming_time-100;	// Намали текущото оставащо време със 100 милисекунди
		await sleep(100);					// Изчакай 100 милисекунди до следващото обновяване на прогреса
	}
	
}
function NewGame(){		// Подготовка на полето за нова игра
	isPressed = true;	// Вдигни флага за успешно натиснато поле
	score = 0;			// Нулирай резултата
	$('.board td').each(function() {		// Обходи игралното поле и изчисти червените полета ако има такива
		$(this).removeClass('board-pull');
		$(this).addClass('board-cell');
	});

	$('.btn-submit').hide();	// Скрий бутона за добавяне в класацията
	$('.btn-start').show();		// Изведи бутона за начало на нова игра
}

function RandomPosition() {
	var randomNum = Math.floor(Math.random() * 8);	// Генерирай случайно число в диапазона [0:8]
	var randomtd = $('td').eq(randomNum);			// Взимане на съответната клетка
	$(randomtd).parents('table').find('td').each( function( index, element ) {	// Изчистване на стари червени точки от игралното поле
		$(element).removeClass('board-pull');
		$(element).addClass('board-cell');
	});

	randomtd.addClass('board-pull');				// Поставяне на червена точка на новото случайно поле
}

function sleep(ms) {								// Изчакване
	return new Promise(resolve => setTimeout(resolve, ms));
}

function AddScore(user_name, score){		// Добавяне на запис в класацията
	$.ajax({
		type: "POST",
		url: "scores.php",
		data: { name: user_name, scores: score},
		success: function(data){
			//alert('Items added');
		},
	});
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

