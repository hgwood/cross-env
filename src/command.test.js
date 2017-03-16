import commandConvert from './command'

test(`converts unix-style env variable usage for windows`, () => {
  expect(commandConvert('$test')).toBe('%test%')
})

test(`leaves command unchanged when not a variable`, () => {
  expect(commandConvert('test')).toBe('test')
})

test(`is stateless`, () => {
  // this test prevents falling into regexp traps like this:
  // http://stackoverflow.com/a/1520853/971592
  expect(commandConvert('$test')).toBe(commandConvert('$test'))
})

test(`converts embedded unix-style env variables usage for windows`, () => {
  expect(commandConvert('$test1/$test2/$test3')).toBe(
    '%test1%/%test2%/%test3%',
  )
})

test(`converts braced unix-style env variable usage for windows`, () => {
  // eslint-disable-next-line no-template-curly-in-string
  expect(commandConvert('${test}')).toBe('%test%')
})
