import {
	ApiBasicAuth, ApiBearerAuth, ApiCookieAuth, ApiOAuth2,
	ApiProperty, ApiSecurity,
	BodyType,
	Optional,
	QueryType,
	ReturnedType,
	Tag,
} from '../decorators.ts';
import {
	Controller,
	Get,
	Patch,
	Post,
	Put,
} from '@danet/core';
import {
	Body,
	Param,
	Query,
} from '@danet/core';
import { Module } from '@danet/core';
import { DanetApplication } from '@danet/core';

class Cat {
	@ApiProperty({description: 'The name of the cat'})
	name!: string;

	@ApiProperty({description: 'The breed of the cat'})
	breed!: string;

	@ApiProperty({description: 'The age of the cat'})
	dob!: Date;

	@Optional()
	@ApiProperty({description: 'The weight of the cat'})
	isHungry?: boolean;

	@ApiProperty({description: 'The color of the cat'})
	color?: any;

	@ApiProperty({description: 'The hobbies of the cat'})
	hobbies?: any[];

	constructor() {
	}
}

class CatSearch {
	@ApiProperty({description: 'The name of the cat'})
	name: string;

	@Optional()
	@ApiProperty({description: 'The breed of the cat'})
	breed?: string;

	@Optional()
	@ApiProperty({description: 'The age of the cat'})
	age?: number;

	nonDecoratedProperty!: string;

	constructor(name: string) {
		this.name = name;
	}
}

class Todo {
	@ApiProperty({description: 'The title of the todo'})
	title!: string;

	@ApiProperty({description: 'The description of the todo'})
	description!: string;

	@ApiProperty({description: 'The version of the todo'})
	version!: number;

	@ApiProperty({description: 'The cat of the todo'})
	cat!: Cat;

	constructor() {
	}
}

export class NameSearch {
	@ApiProperty({description: '请传入你想打招呼的人'})
	name!: string;
}

@Controller('hello')
class HelloController {
	@ApiProperty({description: '对某个人打招呼'})
	@Get()
	@QueryType(NameSearch)
	@ReturnedType(String, false, '我们会对这个人说hello')
	hello(@Query() search: NameSearch) {
		return `Hello ${search.name}`;
	}
}

@Controller('my-endpoint')
class MyController {

	@ApiBearerAuth()
	@ReturnedType(Cat, true)
	@QueryType(CatSearch)
	@Get()
	getSomething(): Cat[] {
		return [new Cat()];
	}

	@ApiOAuth2(['my-permission:all'])
	@ReturnedType(Todo)
	@Post()
	postSomething(@Body() todo: Todo): number {
		return 1;
	}

	@ApiCookieAuth()
	@ReturnedType(Boolean)
	@Patch('somethingagain')
	patchSomething(): boolean {
		return true;
	}

	@BodyType(Todo)
	@Put('somethingagain')
	putSomething(): Todo {
		return new Todo();
	}
}



@ApiBasicAuth()
@Tag('second')
@Controller('second-endpoint')
class SecondController {
	@ApiSecurity('basic')
	@Get()
	getSecond() {
		return 'hello';
	}

	@Tag('third')
	@Get(':id/:name')
	getSomethingByIdAndName(@Param('id') id: string) {
	}
}

@Module({
	controllers: [SecondController, HelloController],
})
class SecondModule {
}

@Module({
	imports: [SecondModule],
	controllers: [MyController],
})
class MyModule {
}

export const app = new DanetApplication();
await app.init(MyModule);
