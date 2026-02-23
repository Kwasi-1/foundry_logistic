/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from '@nextui-org/react';
import { Icon } from '@iconify/react';
import { Input } from '@nextui-org/input';
import { Select, SelectItem } from '@nextui-org/select';
import React, { FC, InputHTMLAttributes, RefCallback } from 'react';

interface CustomSelectFieldProps {
	label?: string;
	placeholder?: string;
	error?: string;
	labelPlacement?: 'outside' | 'outside-left' | 'inside';
	className?: string;
	value?: string;
	options: Array<{ label: string; value: any } | string>;
	required?: boolean;
	selectionMode?: 'single' | 'multiple';
	inputProps?: {
		onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
		onBlur?: (e: any) => unknown;
		ref?: RefCallback<HTMLSelectElement>;
		name?: string;
		required?: boolean;
		disabled?: boolean;
		isDisabled?: boolean;
		selectedKeys?: Array<any>;
	};
	isLoading?: boolean;
}

export const CustomSelectField: FC<CustomSelectFieldProps> = ({
	label = '',
	options,
	error,
	inputProps,
	value,
	placeholder,
	className,
	required = false,
	isLoading = false,
	labelPlacement = 'inside',
	selectionMode = 'single',
}) => {
	return (
		<div>
			<Select
				variant={'faded'}
				size="md"
				aria-label="*"
				value={value}
				// label={required ? `${label} *` : label}
				label={
					required ? (
						<span>
							{label} <span className="text-red-500">*</span>
						</span>
					) : (
						label
					)
				}
				placeholder={placeholder}
				labelPlacement={labelPlacement}
				selectionMode={selectionMode}
				selectedKeys={selectionMode == 'single' ? [value] : value}
				radius="sm"
				isLoading={isLoading}
				{...(inputProps ?? {})}
				classNames={{
					trigger: cn(
						`data-[hover=true]:shadow-none shadow-none border border-black/30 dark:border-secondary-gray dark:bg-[#252525] bg-gray-100/80 text-xs h-12`,
						className,
					),
					label: ' text-xs uppercase',
					popoverContent: 'rounded-md',
				}}>
				{options?.map((option: any) => (
					<SelectItem
						classNames={{
							base: 'rounded-md',
						}}
						key={option?.value || option}
						value={option?.value || option}>
						{option?.label || option}
					</SelectItem>
				))}
			</Select>

			<span className="text-red-400 text-xs">{error}</span>
		</div>
	);
};

// CUSTOM INPUT
interface CustomInputTextFieldProps
	extends InputHTMLAttributes<HTMLInputElement> {
	type?: 'text' | 'number' | 'date' | 'password';
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => unknown;
	placeholder?: string;
	required?: boolean;
	error?: string;
	height?: string;
	value?: string;
	labelPlacement?: 'outside' | 'outside-left' | 'inside';
	label?: string;
	isLoading?: boolean;
	disabled?: boolean;
	inputProps?: {
		onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
		onBlur?: (e: any) => unknown;
		ref?: RefCallback<HTMLInputElement>;
		name?: string;
		min?: string | number;
		max?: string | number;
		maxLength?: number;
		minLength?: number;
		pattern?: string;
		required?: boolean;
		disabled?: boolean;
	} & Record<string, any>;
	startContent?: React.ReactNode;
	isClearabe?: boolean;
	onClear?: () => void;
}

export const CustomInputTextField = (props: CustomInputTextFieldProps) => {
	const {
		type,
		label,
		placeholder,
		required = false,
		inputProps,
		error,
		isLoading = false,
		disabled,
		value,
		onChange,
		height = 'min-h-[49px]',
		labelPlacement = 'inside',
		startContent,
		isClearabe = false,
		onClear,
		onKeyDown,
	} = props;

	const [isVisible, setIsVisible] = React.useState(false);

	const toggleVisibility = () => setIsVisible(!isVisible);

	return (
		<div>
			<div className="relative">
				{isLoading && (
					<Icon
						icon="eos-icons:loading"
						className={`absolute z-10 top-1/2 -translate-y-1/2 right-0 bottom-6 text-[25px] mr-2 mb-1`}
					/>
				)}

				<Input
					onClear={onClear}
					isClearable={isClearabe}
					onChange={onChange}
					size="sm"
					type={type === 'password' ? (isVisible ? 'text' : 'password') : type}
					value={value}
					label={
						required ? (
							<span>
								{label} <span className="text-red-500">*</span>
							</span>
						) : (
							label
						)
					}
					onKeyDown={onKeyDown}
					placeholder={placeholder}
					startContent={startContent}
					labelPlacement={labelPlacement}
					endContent={
						type === 'password' ? (
							<button
								className="focus:outline-none"
								type="button"
								onClick={toggleVisibility}>
								{isVisible ? (
									<Icon icon="majesticons:eye-off" />
								) : (
									<Icon icon="majesticons:eye" />
								)}
							</button>
						) : null
					}
					{...(inputProps ?? {})}
					variant="faded"
					disabled={disabled}
					classNames={{
						input: 'outline-none focus:border-none',
						inputWrapper: `border border-black/30 dark:border-secondary-gray dark:bg-[#252525] bg-gray-100/80 focus-visible:ring-black disabled:cursor-not-allowed disabled:opacity-50 ${height}`,
						label: 'text-xs uppercase',
					}}
				/>
			</div>

			<span className="text-red-400 text-xs">{error}</span>
		</div>
	);
};

interface CustomTextareaFieldProps {
	error?: string;
	placeholder: string;
	label?: string;
	inputProps?: {
		onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => unknown;
		onBlur?: (e: React.ChangeEvent<HTMLTextAreaElement>) => unknown;
		ref?: RefCallback<HTMLTextAreaElement>;
		name?: string;
		value?: string;
		min?: string | number;
		max?: string | number;
		maxLength?: number;
		minLength?: number;
		pattern?: string;
		required?: boolean;
		disabled?: boolean;
	};
}

export const CustomTextareaField = ({
	placeholder,
	error,
	inputProps,
	label,
}: CustomTextareaFieldProps) => {
	return (
		<div className="flex flex-col w-full">
			<label className="px-1  text-xs uppercase">
				{inputProps?.required ? (
					<span>
						{label} <span className="text-red-500">*</span>
					</span>
				) : (
					label
				)}
			</label>
			<div className="w-full border border-black/30 dark:border-secondary-gray dark:bg-[#252525] bg-gray-100/80 flex flex-col rounded-md text-sm justify-center">
				<textarea
					className="bg-transparent h-[100px] w-full px-2 py-1 outline-none focus:border-none"
					{...(inputProps ?? {})}
					placeholder={placeholder}></textarea>
			</div>
			{error ? <span className="text-red-400 text-xs">{error}</span> : null}
		</div>
	);
};
