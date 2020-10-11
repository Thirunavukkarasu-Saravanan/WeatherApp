const APIKEY = "439d4b804bc8187953eb36d2a8c26a02";
const APIURL = "https://openweathermap.org/data/2.5/weather";

const enumAlertType = {
  error: Symbol("ERROR"),
  warn: Symbol("WARN"),
  info: Symbol("INFO"),
};

function ShowAlert(msg, type) {}
function ShowWeatherInfo(ajaxResponse) {
  const data = ajaxResponse;
  const iconUrl = function (iconCode) {
    return "http://openweathermap.org/img/w/" + iconCode + ".png";
  };
  const weatherInfo = data.weather[0];
  const eleWeather = $(".weather");
  eleWeather.find(".weather-name").text(weatherInfo.main);
  eleWeather.find(".weather-icon").attr("src", iconUrl(weatherInfo.icon));

  const mainInfo = data.main;
  const eleMoreInfo = $(".more-info");
  eleMoreInfo.find(".temperature>.info-card-value").text(toFahreinhet(mainInfo.temp));
  eleMoreInfo.find(".humidity>.info-card-value").text(mainInfo.humidity);
  eleMoreInfo.find(".pressure>.info-card-value").text(mainInfo.pressure);

  const elePlace = $(".place");
  elePlace.find(".city").text(data.name);
  elePlace.find(".country").text(" (" + data.sys.country + ")");

  ToggleResults(true);
}


function toFahreinhet(temp){
  fahrValue = (temp * 9/5) + 32;
  return fahrValue.toFixed(2);
}

function ToggleResults(isShowHide) {
  if (!isShowHide) $(".result").hide();
  else $(".result").show();
}

function onKeyEnter(elObj, eventParams) {
  eventParams.preventDefault();
  jqGetWeatherInfo($(elObj).find("input").val());
}

function jqGetWeatherInfo(strCity) {
  ToggleResults(false);
  if (!strCity) ShowAlert("Please enter a valid city name", "error");
  const url = APIURL + "?q=" + strCity + "&appid=" + APIKEY;
  console.log(url);
  $.ajax({
    type: "GET",
    url: url,
    dataType: "json",
    success: function (response) {
      console.log(response);
      ShowWeatherInfo(response);
    },
    error: function (errorResponse) {
      console.log(response);
      ShowAlert("Please enter a valid city name", enumAlertType.error);
    },
  }).fail(function (assd) {
    console.log(assd);
  });
}

document.getElementsByTagName("html")[0].style.display = "none";
$(document).ready(function () {
  setInterval(function () {
    const getDateAndTime = function (cd) {
      return {
        strDate:
          cd.getFullYear() + "/" + (cd.getMonth() + 1) + "/" + cd.getDate(),
        strTime:
          (cd.getHours() < 10 ? "0" + cd.getHours() : cd.getHours()) +
          ":" +
          cd.getMinutes() +
          ":" +
          (cd.getSeconds() < 10 ? "0" + cd.getSeconds() : cd.getSeconds()),
      };
    };
    const t = getDateAndTime(new Date());
    $(".local-time").text(t.strTime);
    $(".local-date").text(t.strDate);
  }, 1000);

  $("html").show();
  ToggleResults();
});
