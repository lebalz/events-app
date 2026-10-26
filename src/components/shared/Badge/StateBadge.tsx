import { Base } from '.';
import Error from './Error';
import Loading from './Loading';
import Success from './Success';

interface IconProps {
    size?: number;
    state: 'success' | 'error' | 'loading';
    text?:
        | string
        | {
              success: string;
              error: string;
              loading: string;
          };
    title?:
        | string
        | {
              success: string;
              error: string;
              loading: string;
          };
}

type Props = IconProps & Base;

const StateBadge = (props: Props) => {
    const text = props.text && (typeof props.text === 'string' ? props.text : props.text[props.state]);
    const title = props.title && (typeof props.title === 'string' ? props.title : props.title[props.state]);
    switch (props.state) {
        case 'success':
            return <Success {...props} text={text} title={title} />;
        case 'error':
            return <Error {...props} text={text} title={title} />;
        case 'loading':
            return <Loading {...props} text={text} title={title} />;
    }
};

export default StateBadge;
