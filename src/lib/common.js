const common = {
  customPropsFilter(props, className) {
    const customProps = {};
    let name;
    let value;
    if (className) {
      customProps.class = className;
    }

    for (name in props) {
      if (name.indexOf('nt-') === 0) {
        value = `${props[name]}`;
        name = name.slice(3);
        customProps[name] = value;
      }
      // Allow add event
      else if (name.indexOf('on') === 0 && typeof props[name] === 'function') {
        customProps[name] = props[name];
      } else if (name === 'style') {
        customProps.style = props.style;
      } else if (name === 'className') {
        if (customProps.class) {
          customProps.class = `${className} ${props.className}`;
        } else {
          customProps.class = props.className;
        }
      }
    }

    return customProps;
  },
  mergeStyle(props) {
    const { span, offset, style } = props;
    const unit = 100 / 12;
    const customStyle = {};

    if (span) {
      customStyle.width = `${span * unit}%`;
    }

    if (offset) {
      customStyle.marginLeft = `${offset * unit}%`;
    }

    if (style) {
      for (const key in style) {
        customStyle[key] = style[key];
      }
    }

    return customStyle;
  },
};

export default common;
