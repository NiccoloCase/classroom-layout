import { Length, IsString, IsOptional, ArrayMaxSize, IsEmail } from "class-validator";

export class SendFeedbackDTO {
    @IsString()
    @IsEmail()
    email: string;
    @IsString({ each: true })
    @Length(3, 200, { each: true })
    @ArrayMaxSize(20)
    selectedValues: string[];
    @IsString()
    @IsOptional()
    @Length(3, 200)
    textField?: string;
}