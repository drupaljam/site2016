module CustomHelpers
  def fill_slots(from, to, slots)
    slots.reduce [] do |result, slot|
      if result.empty?
        if slot['from'] > from
          result << {
            'type' => 'empty',
            'from' => from,
            'to' => slot['from']
          }
        end
      else
        if slot['from'] > result.last['to']
          result << {
            'type' => 'empty',
            'from' => result.last['to'],
            'to' => slot['from']
          }
        end
      end

      result << slot
    end
  end

  def program_time_columns(program)
    (program['from']...program['to']).step(15*60).reduce([]) do |result, t|
      from = t
      to = t + 15*60

      split = result.empty? || program['rooms'].any? do |room|
        room['slots'].any? do |slot|
          (slot['from'] == from) || (slot['to'] == from)
        end
      end
      
      if split
        result.last['last'] = false unless result.empty?

        result << {
          'from' => from,
          'to' => to,
          'last' => true
        }
        next result
      end

      result.last['to'] = to
      next result
    end
  end
end