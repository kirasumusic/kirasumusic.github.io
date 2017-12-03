function showOnLoad() {
  var hiddenItems = selectAll(".showOnLoad");
  for (var i = 0; i < hiddenItems.length; i++){
    hiddenItems[i].style("visibility", "visible");
  }
}
