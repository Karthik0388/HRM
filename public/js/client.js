let alert = document.querySelector(".alert");

setTimeout(function () {
  alert.style.transform = `translate(500px)`;
  alert.style.transition = "ease all 0.7s";
  alert.style.position = "fixed";
 }, 5000);

{
  alert.style.transform = `translate(0px)`;
  alert.style.transition = "ease all 0.7s";
}
