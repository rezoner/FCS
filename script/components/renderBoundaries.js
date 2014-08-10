COMPONENTS.renderBoundaries = {

  render: function(entity, delta, layer) {
    switch (entity.shape) {
      case "rectangle":
        layer.strokeStyle(entity.color).strokeRect(entity.x | 0, entity.y | 0, entity.width, entity.height);
        break;
      case "circle":
        layer.lineWidth(2).strokeStyle(entity.color).strokeCircle(entity.x | 0, entity.y | 0, entity.radius);
        break;
    }
  }

};