export type ButtonProps = {
    title: String;
    styles?: String;
};

export type FormFieldProps = {
    title: string;
    type: string;
    placeholder: string;
    className?: string;
    value: string;
    onChange: (e:React.ChangeEvent<HTMLInputElement>) => void;
};